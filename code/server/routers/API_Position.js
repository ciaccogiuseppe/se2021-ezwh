const express = require('express');
const app = express.Router();

const positionDAO = require('../DB/positionDAO.js')
const db = require('../DB/db.js')
const position_dao = new positionDAO(db);

///---------------------------------------------------------------------------------------------------------------------///
  ///-------------------------------------------------------POSITION------------------------------------------------------///
  
  app.get('/api/positions', async (req, res) =>{
    try{
      const result = await position_dao.getAllPositions();
      return  res.status(200).json(result);
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  
  app.post('/api/position', async (req, res) =>{
    try{
      const position = {
        positionID: req.body.positionID,
        aisleID: req.body.aisleID,
        row: req.body.row,
        col: req.body.col,
        maxWeight: req.body.maxWeight,
        maxVolume: req.body.maxVolume
      }
      
      if(
        isNaN(position.maxWeight) || position.maxWeight < 0 ||
        isNaN(position.maxVolume) || position.maxVolume < 0 ||
        position.row.length !== 4 || position.col.length !== 4 || position.aisleID.length !== 4 ||
        position.positionID !== (position.aisleID + position.row + position.col)
        )
        {
          return res.status(422).end();
        }
      await position_dao.createPosition(position);
      return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  app.put('/api/position/:positionID', async (req, res) =>{
    try{
      const positionID = req.params.positionID
      const position = {
        aisleID: req.body.newAisleID,
        row: req.body.newRow,
        col: req.body.newCol,
        maxWeight: req.body.newMaxWeight,
        maxVolume: req.body.newMaxVolume,
        occupiedWeight: req.body.newOccupiedWeight,
        occupiedVolume: req.body.newOccupiedVolume
      }
  
      const positionExists = await position_dao.getAllPositions().filter((a)=>a.positionID == req.params.positionID);
      //console.log(positionExists);
      if(positionExists.length == 0){
        return res.status(404).end();
      }
      //console.log(position);
      if(positionID.length !== 12 ||
        isNaN(position.maxWeight) || position.maxWeight < 0 ||
        isNaN(position.maxVolume) || position.maxVolume < 0 ||
        isNaN(position.occupiedWeight) || position.occupiedWeight < 0 ||
        isNaN(position.occupiedVolume) || position.occupiedVolume < 0 ||
        position.row.length !== 4 || position.col.length !== 4 || position.aisleID.length !== 4
        ){
          return res.status(422).json({message:"Unprocessable entity"}).end();
      }
      
      await position_dao.updatePosition(positionID, position);
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  
  app.put('/api/position/:positionID/changeID', async (req, res) =>{
    try{
      const positionID = req.params.positionID;
      const newPositionID = req.body.newPositionID;
  
      const positionExists = await position_dao.getAllPositions().filter((a)=>a.positionID == positionID);

      if(
        positionID == undefined ||
        newPositionID == undefined ||
        positionID.length !== 12 ||
        newPositionID.length !== 12 ||
        isNaN(positionID) ||
        isNaN(newPositionID)){
          return res.status(422).end();
      }
      //console.log(positionExists);
      if(positionExists.length == 0){
        return res.status(404).end();
      }
      
      
      //console.log(positionID);
      await position_dao.updatePositionID(positionID, newPositionID);
      return res.status(200).end();
    }
    catch(err){
      return  res.status(503).end();
    }
    
  })
  
  
  app.delete('/api/position/:positionID', async (req, res) =>{
    if(req.params.positionID.length !== 12){
      return res.status(422).json({message:"Unprocessable entity"}).end();
    }
    try{
      await position_dao.deletePosition(req.params.positionID);
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })

module.exports = app;