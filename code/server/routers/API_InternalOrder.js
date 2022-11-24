const express = require('express');
const app = express.Router();

const internalOrderDAO = require('../DB/internalOrderDAO.js')
const db = require('../DB/db.js');
const skuDAO = require('../DB/skuDAO.js');
const internalOrder_dao = new internalOrderDAO(db);
const sku_dao = new skuDAO(db);
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)


///---------------------------------------------------------------------------------------------------------------------///
  ///---------------------------------------------------------Internal order---------------------------------------------------------///
  app.get('/api/internalOrders', async (req, res) =>{
    try{
      const result = await internalOrder_dao.getAllInternalOrders();
      for (const d of result){
        let m = await internalOrder_dao.getProducts(d.id)
        if (m.length != 0){
          d.products=[];
        }
        for (const pr of m){
          
          if(d.state != "COMPLETED"){
            d.products.push({SKUId:pr.productId, description:pr.description, price:pr.price, qty:pr.quantity});
            
          }
          else{
            const rr = await internalOrder_dao.getProductsRfid(d.id, pr.productId);
            //console.log(rr);
            for (const r of rr){
              d.products.push({SKUId:pr.productId, description:pr.description, price:pr.price, rfid:r.rfid});
            }
          }
          
        }
      }
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  
  app.get('/api/internalOrdersIssued', async (req, res) =>{
    try{
      const result = await internalOrder_dao.getInternalOrdersState("ISSUED");
      for (const d of result){
        let m = await internalOrder_dao.getProducts(d.id)
        if (m.length != 0){
          d.products=[];
        }
        for (const pr of m){
          let s = await sku_dao.getSKU(pr.productId);
          //s = s[0];
  
          d.products.push({SKUId:s.id, description:s.description, price:s.price, qty:pr.quantity});
          
        }
      }
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  app.get('/api/internalOrdersAccepted', async (req, res) =>{
    try{
      const result = await internalOrder_dao.getInternalOrdersState("ACCEPTED");
      for (const d of result){
        let m = await internalOrder_dao.getProducts(d.id)
        if (m.length != 0){
          d.products=[];
        }
        for (const pr of m){
          let s = await sku_dao.getSKU(pr.productId);
  
          d.products.push({SKUId:s.id, description:s.description, price:s.price, qty:pr.quantity});
          
        }
      }
      return res.status(200).json(result).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  
  app.get('/api/internalOrders/:id', async (req, res) =>{
    try{
      if(req.params.id == undefined || isNaN(req.params.id)){
        return res.status(422).end();
      }
  
      const result = await internalOrder_dao.getAllInternalOrders();
      for (const d of result){
        let m = await internalOrder_dao.getProducts(d.id)
        if (m.length != 0){
          d.products=[];
        }
        for (const pr of m){
          if(d.state != "COMPLETED"){
            d.products.push({SKUId:pr.productId, description:pr.description, price:pr.price, qty:pr.quantity});
            
          }
          else{
            const rr = await internalOrder_dao.getProductsRfid(d.id, pr.productId);
            for (const r of rr){
              d.products.push({SKUId:pr.productId, description:pr.description, price:pr.price, rfid:r.rfid});
            }
            
          }
          
        }
      }
      
      
      const ress = result.filter(a => a.id == req.params.id)
      if(ress.length == 0){
        return res.status(404).end();
      }
      return res.status(200).json(ress[0]).end();
    }
    catch(err){
      return res.status(500).end();
    }
    
  })
  
  
  app.post('/api/internalOrders', async (req, res) =>{
    try{
      //console.log(req.body);
      const internalOrder = {
        issueDate:req.body.issueDate,
        customerId:req.body.customerId
      
      }
  
      if(internalOrder.issueDate == undefined
        || internalOrder.customerId == undefined
        ||
          (
            !dayjs(internalOrder.issueDate, 'YYYY/MM/DD', true).isValid() &&
            !dayjs(internalOrder.issueDate, 'YYYY/MM/DD HH:mm', false).isValid()
          )){
          return res.status(422).end();
        }
  
      const skus = await sku_dao.getAllSKU().map(a=>a.id);
  
      /*for (const p of req.body.products){
        if(!skus.includes(p.SKUId)){
          return res.status(422).end();
        }
      }*/
      
      for (const p of req.body.products){
        if(p.SKUId < 0){
          return res.status(422).end();
        }
      }
  
      await internalOrder_dao.insertInternalOrder(internalOrder, req.body.products || []);
  
      return res.status(201).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })
  
  
  app.put('/api/internalOrders/:id', async (req, res) =>{
    try{
      const internalOrder = {
        state:req.body.newState,
        products:req.body.products || []
      }
      if (internalOrder.state == undefined || req.params.id == undefined || isNaN(req.params.id)){
        return res.status(422).end();
      }
  
      let ord = await internalOrder_dao.getAllInternalOrders();
      ord = ord.filter(a=>a.id == req.params.id);
      
      if(ord.length == 0){
        return res.status(404).end();
      } 
      await internalOrder_dao.modifyInternalOrder(req.params.id, internalOrder);
      
      return res.status(200).end();
    }
    catch(err){
      return res.status(503).end();
    }
    
  })
  
  app.delete('/api/internalOrders/:id', async (req, res) =>{
    try{
      if(req.params.id == undefined || isNaN(req.params.id)){
        return res.status(422).end();
      }
      await internalOrder_dao.deleteInternalOrder(req.params.id)
      return res.status(204).end();
    }
    catch(err){
      return res.status(503).end();
    }
  })

module.exports = app;