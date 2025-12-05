import hotelModel, { IHotel } from "../models/hotelModel.ts";

export const getHotelsByLocation = async (destinationLocation: string) => {
  const [city, province] = destinationLocation.split(',').map(part => part.trim());
  
  const searchConditions: any[] = [
    { location: { $regex: destinationLocation, $options: 'i' } },
    { location: { $regex: city, $options: 'i' } }
  ];
  
  if (province) {
    searchConditions.push({ location: { $regex: province, $options: 'i' } });
  }
  
  return await hotelModel.find({
    $or: searchConditions
  });
};

export const getAllHotels = async () => {
  return await hotelModel.find();
};

// Renamed to avoid conflict
export const createNewHotel = async (hotelData: Partial<IHotel>) => {
  const hotel = new hotelModel(hotelData);
  return await hotel.save();
};

export const getRoomByReferences = async (hotelReference: string, roomReference: string) => {
  const hotel = await hotelModel.findOne({ reference: hotelReference });
  
  if (!hotel) return null;
  
  const room = hotel.rooms.find(room => room.roomReference === roomReference);
  
  if (!room) return null;
  
  // Use toObject() if it exists, otherwise use the room as-is
  const roomData = (room as any).toObject ? (room as any).toObject() : room;
  
  return {
    hotel: {
      name: hotel.name,
      location: hotel.location,
      reference: hotel.reference
    },
    room: {
      ...roomData,
      id: room.roomReference
    }
  };
};



export const deleteHotelService = async (reference: string) => {
  try {

    const result = await hotelModel.findOneAndDelete({ reference });
    
    if (!result) {
      return {
        success: false,
        message: "Hotel not found",
        statusCode: 404
      };
    }

    return {
      success: true,
      message: "Hotel deleted successfully"
    };

  } catch (error: any) {
    console.error("Error in deleteHotel service:", error);
    
    return {
      success: false,
      message: error.message || "Failed to delete hotel",
      statusCode: 500
    };
  }
};