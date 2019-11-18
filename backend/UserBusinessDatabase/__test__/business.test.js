const businessController = require('../controllers/business');  
const businessModel = require('../models/business'); 
const app = require('./testapp') // Link to your server file
const supertest = require('supertest');  
const request = supertest(app); 
const mongoose = require('mongoose');

const dbHandler = require('./db');

const businessData = [
    {
      title: "Homemade Fresh Pasta",
      user: "Alfonso",
      about: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80',
      images: [
        'https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80',
        "https://images.unsplash.com/photo-1560785477-d43d2b34e0df?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"
      ],
      rating: 4.15,
      region: "Central Vancouver",
      location: {
        lat: 49.2102,
        long: -123.1172
      },
      price: "$15/set",
      tags: ["language", "korean", "japanese"]
    },
  ]; 

  beforeAll(async () => {await dbHandler.connect(); });

  /**
   * Clear all test data after every test.
   */
  // afterEach(async () => await dbHandler.clearDatabase());
  
  /**
   * Remove and close the db and server.
   */
  afterAll(async () => {await dbHandler.closeDatabase(); app.close()});

describe('Business Integration Tests', () => {

    it('Can make a post request', async done => {
        const response = await request.post('/business/post').send({business : businessData[0]});
        expect(response.status).toBe(201);
        expect(response.body.business.title).toBe(businessData[0].title);
        
        done();
      });   

      it('Can make a get request getting a user by id', async done => { 
        
        const business = await request.post('/business/post').send({business : businessData[0]}); 
        const id = business.body.business._id; 

        const response = await request.get('/business/get/'+id); 

        expect(response.status).toBe(200);
        expect(response.body.business.title).toBe(businessData[0].title);
        
        done();
      });   

      it('Can make a delete request', async done => { 
        
        const business = await request.post('/business/post').send({business : businessData[0]}); 
        const id = business.body.business._id; 

        const response = await request.delete('/business/delete/'+id); 

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('deleted');
        
        done();
      });  

      it('Can make a put request and update business', async done => { 
        
        const business = await request.post('/business/post').send({business : businessData[0]}); 
        const id = business.body.business._id; 

        const response = await request.put('/business/put/'+id).send({business : {title: 'changed title'}}); 

        expect(response.status).toBe(200);
        expect(response.body.business.title).toBe('changed title');
        
        done();
      });  

}); 

describe('Business Unit Tests', () => { 

  const mockRequest = (sessionData, body,params) => ({
    session: { data: sessionData },
    body, 
    params
  });
  
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  }; 

  const mockNext = jest.fn();

  

  it('can successfully add data to DB', async done => { 
    const req = mockRequest(
      {},
      { business : businessData[0] }, 
      {}
    ); 
    const res = mockResponse(); 
    const next = mockNext;
    const result =  await businessController.postBusinessData(req, res,next);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.anything());
      
      done();
    });  

    it('can successfully update data in DB', async done => {  
      const business = new businessModel(businessData[0]);

     const id = await business.save();  

      const req = mockRequest(
        {},
        {business : {title : 'new title'}}, 
        { businessId : id.id}
      ); 
      const res = mockResponse(); 
      const next = mockNext;
      const result =  await businessController.updateBusinessData(req, res,next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.anything());
        
        done();
      }); 

  

});