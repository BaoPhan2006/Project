const Event = require("../models/event");

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      eventDate,
      capacity,
      price
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !location ||
      !eventDate ||
      !capacity ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required event fields"
      });
    }

    const newEvent = await Event.create({
      title,
      description,
      category,
      location,
      eventDate,
      capacity,
      price,
      createdBy: req.user.id
    });

    return res.status(201).json({
      message: "Event created successfully",
      event: newEvent
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "active" })
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "fullName email"
    );

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this event"
      });
    }

    const {
      title,
      description,
      category,
      location,
      eventDate,
      capacity,
      price,
      status
    } = req.body;

    event.title = title ?? event.title;
    event.description = description ?? event.description;
    event.category = category ?? event.category;
    event.location = location ?? event.location;
    event.eventDate = eventDate ?? event.eventDate;
    event.capacity = capacity ?? event.capacity;
    event.price = price ?? event.price;
    event.status = status ?? event.status;

    const updatedEvent = await event.save();

    return res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to delete this event"
      });
    }

    event.status = "cancelled";
    await event.save();

    return res.status(200).json({
      message: "Event cancelled successfully",
      event
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};