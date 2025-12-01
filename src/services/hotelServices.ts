// services/hotelServices.ts
import hotelModel from "../models/hotelModel.ts";

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

export const createHotel = async (hotelData: any) => {
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