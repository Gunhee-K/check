
module.exports.routes = {


  '/': { view: 'pages/homepage' },
  '/events': { view: 'events/index' },
  '/user': { view: 'pages/userpage'},

  // API Routes
  'GET /api/events': 'EventController.fetchEvents',
  'POST /api/events': 'EventController.addEvent',
  'DELETE /api/events/:id': 'EventController.deleteEvent'

};
