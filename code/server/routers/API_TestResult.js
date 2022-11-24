const express = require('express');
const app = express.Router();

const testResultDAO = require('../DB/testResultDAO.js')
const skuitemDAO = require('../DB/skuItemDAO.js')
const testDescriptorDAO = require('../DB/testDescriptorDAO.js')

const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const db = require('../DB/db.js')
const testResult_dao = new testResultDAO(db);
const testDescriptor_dao = new testDescriptorDAO(db);
const skuitem_dao = new skuitemDAO(db);

///---------------------------------------------------------------------------------------------------------------------///
  ///---------------------------------------------------------Test Result---------------------------------------------------------///
  app.get('/api/skuitems/:rfid/testResults', async (req, res) =>{
    try{
      if (req.params.rfid.length !== 32){
        return res.status(422).end();
      }
      const skuItems = await skuitem_dao.getSKUItemByRFID(req.params.rfid);
      if(skuItems.length == 0){
        return res.status(404).end();
      }
      let result = await testResult_dao.getTestResults(req.params.rfid);
      result.forEach(a => a.Result = a.Result == "false" ? false:true);
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  
  app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) =>{
    try{
      if (!req.params.rfid || (req.params.rfid && req.params.rfid.length) !== 32 || isNaN(req.params.rfid)
      || req.params.id == undefined || isNaN(req.params.id)){
        return res.status(422).end();
      }
      const skuItems = await skuitem_dao.getSKUItemByRFID(req.params.rfid);
      if(skuItems.length == 0){
        return res.status(404).end();
      }
      const result = await testResult_dao.getTestResults(req.params.rfid);
      const ress = result.filter((a)=>a.id == req.params.id);
      if(ress.length == 0){
        return res.status(404).end();
      }
      ress.forEach(a => a.Result = a.Result !== "false");
      return res.status(200).json(ress[0]).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.post('/api/skuitems/testResult', async (req, res) =>{
    try{
      
      const testResult = {
        rfid: req.body.rfid,
        idTestDescriptor: req.body.idTestDescriptor,
        Date: req.body.Date,
        Result: req.body.Result
      }
  
      if(!testResult.rfid || (testResult.rfid && testResult.rfid.length !== 32)
          || !testResult.idTestDescriptor
          || (testResult.idTestDescriptor
                && (isNaN(testResult.idTestDescriptor) || testResult.idTestDescriptor < 0)
              )
          || !testResult.Date || testResult.Result == undefined
          ||
          (
            !dayjs(testResult.Date, 'YYYY/MM/DD', true).isValid() &&
            !dayjs(testResult.Date, 'YYYY/MM/DD HH:mm', true).isValid()
          )      
        ){
        return res.status(422).end();
      }
  
      const testDescriptor = await testDescriptor_dao.getTestDescriptorById(testResult.idTestDescriptor);
      if(testDescriptor.length == 0){
        return res.status(404).end();
      }
  
  
      const result = await skuitem_dao.getSKUItemByRFID(testResult.rfid);
      //console.log(result);
      if(result.length == 0){
        return res.status(404).end();
      }
  
      testResult_dao.createTestResult(testResult);
  
      return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })
  
  
  app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) =>{
    try{
      const testResult = {
        idTestDescriptor: req.body.newIdTestDescriptor,
        Date: req.body.newDate,
        Result: req.body.newResult
      }
  
      //console.log(testResult);
  
      if (!req.params.rfid || (req.params.rfid && req.params.rfid.length) !== 32
      || !req.params.id || isNaN(req.params.id)
      || !testResult.idTestDescriptor
      || !testResult.Date
      || testResult.Result == undefined
      ||
      (
        !dayjs(testResult.Date, 'YYYY/MM/DD', true).isValid() &&
        !dayjs(testResult.Date, 'YYYY/MM/DD HH:mm', false).isValid()
      )
      ){
        return res.status(422).end();
      }
  
      const testDescriptor = await testDescriptor_dao.getTestDescriptorById(testResult.idTestDescriptor);
      if(testDescriptor.length == 0){
        return res.status(404).end();
      }
  
      const result = await skuitem_dao.getSKUItemByRFID(req.params.rfid);
      if(result.length == 0){
        return res.status(404).end();
      }
      if(result.length == 0){
        return res.status(404).end();
      }
  
      await testResult_dao.modifyTestResult(req.params.id, req.params.rfid, testResult);
      
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  
  app.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) =>{
    if (!req.params.rfid || (req.params.rfid && req.params.rfid.length !== 32)
      || !req.params.id || isNaN(req.params.id) || isNaN(req.params.rfid)){
      return res.status(422).end();
    }
  
    try{
      await testResult_dao.deleteTestResult(req.params.id, req.params.rfid)
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })

module.exports = app;