const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 }).lean();
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        let event;

        // Check if ID is a valid MongoDB ObjectId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            event = await Event.findById(id).lean();
        }
        if (!event) {
            // Otherwise search by slug or eventId
            event = await Event.findOne({
                $or: [{ slug: id }, { eventId: id }]
            }).lean();
        }

        if (event) {
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.set('Pragma', 'no-cache');
            res.set('Expires', '0');
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    try {
        const {
            eventId, title, description, category, subCategory, eventType, club, department,
            date, venue, image, pptTemplateUrl, registrationFee,
            coordinators, facultyCoordinators, studentCoordinators,
            artistName, timings, prize, rules, rounds,
            winnerPrize, runnerPrize, generalPrize, otherPrizes, fromTime, toTime, theme,
            resourcePerson, resourcePersonPosition, resourcePersonCompany,
            gender, teamPrice
        } = req.body;

        const effectiveDepartment = department || subCategory || 'General';
        const effectiveSubCategory = subCategory || department || '';
        const prizesList = otherPrizes || generalPrize || [];

        const event = new Event({
            eventId: eventId || undefined,
            title,
            description,
            category,
            subCategory: effectiveSubCategory,
            eventType: eventType || 'Normal',
            club,
            theme: theme || [],
            department: effectiveDepartment,
            date,
            venue,
            image,
            pptTemplateUrl,
            registrationFee,
            coordinators,
            facultyCoordinators,
            studentCoordinators,
            artistName,
            timings: timings || (fromTime && toTime ? `${fromTime} - ${toTime}` : ''),
            prize,
            rules,
            rounds,
            winnerPrize,
            runnerPrize,
            generalPrize: prizesList,
            otherPrizes: prizesList,
            fromTime,
            toTime,
            resourcePerson,
            resourcePersonPosition,
            resourcePersonCompany,
            gender,
            teamPrice,
            createdBy: req.admin._id
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        console.error('Create Event Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            console.log('Update Event Body:', req.body);

            const {
                eventId, title, description, category, subCategory, eventType, club, department,
                date, venue, image, pptTemplateUrl, registrationFee,
                coordinators, facultyCoordinators, studentCoordinators,
                artistName, timings, prize, rules, rounds,
                winnerPrize, runnerPrize, generalPrize, otherPrizes, fromTime, toTime, theme,
                resourcePerson, resourcePersonPosition, resourcePersonCompany,
                gender, teamPrice
            } = req.body;

            if (eventId !== undefined) event.eventId = eventId;
            event.title = title || event.title;
            event.description = description || event.description;
            event.category = category || event.category;
            if (subCategory !== undefined) event.subCategory = subCategory;
            if (eventType) event.eventType = eventType;
            event.club = club || event.club;
            event.theme = theme !== undefined ? theme : event.theme; // Safer check for array
            event.department = department || subCategory || event.department;
            event.date = date || event.date;
            event.venue = venue || event.venue;
            event.image = image || event.image;
            event.pptTemplateUrl = pptTemplateUrl !== undefined ? pptTemplateUrl : event.pptTemplateUrl;
            event.registrationFee = registrationFee !== undefined ? registrationFee : event.registrationFee;
            event.coordinators = coordinators || event.coordinators;
            event.facultyCoordinators = facultyCoordinators || event.facultyCoordinators;
            event.studentCoordinators = studentCoordinators || event.studentCoordinators;
            event.artistName = artistName || event.artistName;
            event.timings = timings || event.timings;
            event.prize = prize || event.prize;
            event.rules = rules || event.rules;
            event.rounds = rounds || event.rounds;
            event.winnerPrize = winnerPrize || event.winnerPrize;
            event.runnerPrize = runnerPrize || event.runnerPrize;
            
            const prizesList = otherPrizes !== undefined ? otherPrizes : generalPrize;
            if (prizesList !== undefined) {
                event.generalPrize = prizesList;
                event.otherPrizes = prizesList;
            }
            
            event.fromTime = fromTime || event.fromTime;
            event.toTime = toTime || event.toTime;
            event.resourcePerson = resourcePerson || event.resourcePerson;
            event.resourcePersonPosition = resourcePersonPosition || event.resourcePersonPosition;
            event.resourcePersonCompany = resourcePersonCompany || event.resourcePersonCompany;
            event.gender = gender || event.gender;
            event.teamPrice = teamPrice !== undefined ? teamPrice : event.teamPrice;
            event.version = (event.version || 1) + 1;

            const updatedEvent = await event.save();
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error('Update Event Error:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (event) {
            await event.deleteOne();
            res.json({ message: 'Event removed' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
