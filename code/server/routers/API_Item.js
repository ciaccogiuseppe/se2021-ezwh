const express = require('express');
const app = express.Router();

const itemDAO = require ('../DB/itemDAO.js')
const skuDAO = require('../DB/skuDAO.js')
const db = require('../DB/db.js')
const item_dao = new itemDAO(db);
const sku_dao = new skuDAO(db);

///---------------------------------------------------------------------------------------------------------------------///
  ///---------------------------------------------------------ITEM---------------------------------------------------------///
  
  app.get('/api/items', async (req, res) =>{
    try{
      const result = await item_dao.getAllItems();
      
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/items/:id/:supplierId', async (req, res) =>{
    try{
      //console.log(req.params.id);
      if(isNaN(req.params.id) || req.params.id < 0 ||isNaN(req.params.supplierId) || req.params.supplierId < 0){
        return res.status(422).json({message:"Unprocessable entity"}).end();
      }
      const result = await item_dao.getItemById(req.params.id,req.params.supplierId);
      //console.log(req.params.id);
      
      if(result.length === 0){
        return res.status(404).json({message:"Not found"}).end();
      }
      else{
       
        return res.status(200).json(result[0]).end();
      }
      
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.post('/api/item', async (req, res) =>{
    try{
      
      const item = {
        id: req.body.id,
        description: req.body.description,
        price: req.body.price,
        SKUId: req.body.SKUId,
        supplierId:req.body.supplierId,
        
      }
      if(
        item.description === undefined || item.description === ""  )
        {
          return res.status(422).end();
        }else if (
          
          isNaN(item.price) || item.price < 0 /*||
          (item.SKUId && item.SKUId.length !== 12)*/ ||
          isNaN(item.supplierId) || item.supplierId < 0){
            return res.status(422).end();
          }
          const skuID = item.SKUId;
          const skus = await sku_dao.getAllSKU();
          const skuExists = skus.filter((a)=>a.id === skuID);
          if(skuExists.length === 0){
            return res.status(404).end();
          }
          await item_dao.createNewItem(item);
      return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })
  
  app.put('/api/item/:id/:supplierId', async (req, res) =>{
    try{
      const itemID = req.params.id;
      const supplierId = req.params.supplierId;
      const items = await item_dao.getAllItems();
      const itemExists = items.filter((a)=>(a.id === Number(itemID))&(a.supplierId === Number(supplierId)));
  
      if(itemExists.length === 0){
        return res.status(404).end();
      }
  
      const item = {
        newDescription: req.body.newDescription,
        newPrice: req.body.newPrice,
        
      }
   // console.log(skuItem);
      await item_dao.modifyItem(itemID,supplierId, item);
      
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  app.delete('/api/items/:id/:supplierId', async (req, res) =>{
    try{
      if(isNaN(req.params.id) || req.params.id < 0 ||isNaN(req.params.supplierId) || req.params.supplierId < 0){
        return res.status(422).json({message:"Unprocessable entity"}).end();
      }
      const id = req.params.id;
      const supplierId = req.params.supplierId;
      await item_dao.deleteItem(id,supplierId);
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })


module.exports = app;