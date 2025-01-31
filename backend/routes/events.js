const express = require('express');
const Event = require('../models/Event');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Test route to check MongoDB connection
router.get('/test', async (req, res) => {
    try {
        const count = await Event.countDocuments();
        res.json({ 
            message: 'MongoDB connection is working!',
            eventsCount: count,
            status: 'success'
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'MongoDB connection error',
            error: error.message,
            status: 'error'
        });
    }
});

// Get all events
router.get('/', async (req, res) => {
    try {
        const { search, category, status } = req.query;
        let query = {};

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Category filter
        if (category) {
            query.category = category;
        }

        // Status filter
        if (status) {
            query.status = status;
        }

        const events = await Event.find(query)
            .populate('createdBy', 'name email')
            .sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create event
router.post("/", async (req, res) => {
    console.log("Check one: Received request");
    console.log("Request body:", req.body); // Debugging incoming data

    try {
        console.log("Check two: Creating event");
        const newEvent = new Event(req.body);
        console.log("Event creation:", newEvent);

        console.log("Check three: Saving event to DB");
        await newEvent.save(); // Wait for the event to be saved

        console.log("Check four: Event saved successfully");
        res.status(201).json(newEvent);
    } catch (error) {
        console.log("Check five: Error occurred", error);
        res.status(400).json({ message: "Failed to create event", error: error.message });
    }
});

module.exports = router;
 
// Get single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name email');        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update event
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete event
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Register for event
router.post('/:id/register', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name');
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if event is full
        if (event.registeredParticipants.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        // Add user to registered participants
        event.registeredParticipants.push({
            user: req.body.user,
            registeredAt: new Date()
        });

        await event.save();

        res.json({ 
            message: 'Successfully registered for event',
            event
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Unregister from event
router.post('/:id/unregister', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('createdBy', 'name');        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Remove user from registered participants
        event.registeredParticipants = event.registeredParticipants.filter(
            participant => participant.user.toString() !== req.body.user.toString()
        );

        await event.save();

        res.json({ 
            message: 'Successfully unregistered from event',
            event
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get user's registered events
router.get('/user/registered', async (req, res) => {
    try {
        const events = await Event.find({
            'registeredParticipants.user': req.body.user
        })
        .populate('createdBy', 'name email')
        .sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get events created by user
router.get('/user/created', async (req, res) => {
    try {
        const events = await Event.find({ createdBy: req.body.user })
            .populate('createdBy', 'name email')
            .sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
