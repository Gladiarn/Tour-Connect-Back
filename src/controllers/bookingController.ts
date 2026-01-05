import { Request, Response } from 'express';
import { BookingService } from '../services/bookingServices.ts';

export class BookingController {
  private bookingService: BookingService;

  constructor(bookingService?: BookingService) {
    this.bookingService = bookingService || new BookingService();
  }

  // Create a booking
  createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const bookingData = req.body;

      const booking = await this.bookingService.createBooking(userId, bookingData);

      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get ongoing bookings
  getOngoingBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const bookings = await this.bookingService.getOngoingBookings(userId);

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get past bookings
  getPastBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const bookings = await this.bookingService.getPastBookings(userId);

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get all user bookings
  getUserBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const bookings = await this.bookingService.getUserBookings(userId);

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get user favorites
  getUserFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const favorites = await this.bookingService.getUserFavorites(userId);

      res.status(200).json({
        success: true,
        count: favorites.length,
        data: favorites
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };

  // Add to favorites
  addToFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const { reference } = req.body;

      if (!reference) {
        res.status(400).json({
          success: false,
          message: 'reference is required'
        });
        return;
      }

      const favorites = await this.bookingService.addToFavorites(userId, reference);

      res.status(200).json({
        success: true,
        message: 'Added to favorites',
        data: favorites
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Remove from favorites
  removeFromFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const { destinationId } = req.params;

      const favorites = await this.bookingService.removeFromFavorites(userId, destinationId);

      res.status(200).json({
        success: true,
        message: 'Removed from favorites',
        data: favorites
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Get single booking
  getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const { bookingId } = req.params;

      const booking = await this.bookingService.getBookingById(userId, bookingId);

      res.status(200).json({
        success: true,
        data: booking
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  };

  // Update booking status
  updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const { bookingId } = req.params;
      const { status } = req.body;

      const booking = await this.bookingService.updateBookingStatus(userId, bookingId, status);

      res.status(200).json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  // Cancel booking
  cancelBooking = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user._id;
      const { bookingId } = req.params;

      const booking = await this.bookingService.cancelBooking(userId, bookingId);

      res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };
}