
const Order = require('../model/orderModel')
const excel = require('exceljs')
const fs = require('fs')
const PDFDocument = require('pdfkit')



const salesReportGet = async(req,res)=>{
    try{
        const orderData = await Order.find({status:"Delivered"}).populate('user').sort({_id:-1})
       
        const orderCount = orderData.length
        let totalAmount = 0
        orderData.forEach(order => {
            totalAmount+=order.totalamount
        })
        res.render('admin/salesreport',{orderData,orderCount,totalAmount})
    }catch(err){
        console.log(err.message)
    }
}

const filterSalesReportbyDate = async(req,res)=>{
  try{
    const {startDate,endDate} = req.body
    const startingDate = new Date(startDate)
    const endingDate = new Date(endDate)

     const filterData = await Order.find({
        status:"Delivered",
        createdate:{$gte: startingDate , $lte: endingDate}
     }).populate('user')
     console.log(filterData)
     res.json({orders:filterData})

  }catch(err){
    console.log(err.message)
  }
}



const filteringDateRange = async(req,res)=>{
    try{
        
        const {selectOption} = req.body
        const  today = new Date()
        let startDate , endDate

        switch (selectOption) {
            case 'Daily':
                startDate = new Date(today.getFullYear(),today.getMonth(),today.getDate(),0,0,0);
                endDate = new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,59)
                break;
            case 'Weekly':
                const dayOfWeek = today.getDate()
                startDate = new Date(today.getFullYear(),today.getMonth(),today.getDate() - dayOfWeek, 0,0,0)
                endDate = new Date(today.getFullYear(),today.getMonth(),today.getDate() + (6-dayOfWeek),23,59,59)
                break;
            case 'Monthly':
                startDate = new Date(today.getFullYear(),today.getMonth(),1,0,0,0)
                endDate = new Date(today.getFullYear(),today.getMonth() + 1,0,23,59,59)
                break;
            case 'Yearly':
                startDate = new Date(today.getFullYear(), 0,1,0,0,0)
                endDate = new Date(today.getFullYear(),11,31,23,59,59)
                break
            default:
               throw new Error('invlid selectOption')
        }

        const filterData = await Order.find({
            status:'Delivered',
            createdate:{$gt:startDate, $lt:endDate}
        }).populate('user')
        res.json({orders:filterData})
    }catch(err){
        console.log(err.message);
    }
}




const genaratePDF = async(req,res)=>{
    try{
    
        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');

        doc.pipe(res);

        doc.fontSize(24).text('Sales Report', { align: 'center' });
        doc.moveDown();

        const headers = ['OrderID', 'Email', 'Date', 'Coupon', 'Discount', 'Total', 'Payment Method'];

        const orderData = [
            { orderid: '1', email: 'example@example.com', createdate: new Date(), totalamount: 100, paymentmethod: 'Cash' }
           
        ];
        const orders = await Order.find().populate('user');
        const table = {
            headers,
            rows: orders.map(order => [
                order.orderid,
                order.user.email, 
                new Date(order.createdate).toLocaleDateString(),
                'No Coupon',
                'No Discount',
                order.totalamount,
                order.paymentmethod
            ])
        };
       
        drawTable(doc, {
            x: 60,
            y: doc.y,
            width: 500,
            headers: table.headers,
            rows: table.rows
        });

      
        doc.end();

    }catch(err){
        console.error(err.message)
    }
}

function drawTable(doc, options) {
    const {
        x,
        y,
        width,
        headers,
        rows
    } = options;

    const headerHeight = 24;
    const rowHeight = 24;
    const cellPadding = -15; 

  
    doc.fillColor('#000').font('Helvetica').fontSize(10);

   
    headers.forEach((header, i) => {
        doc.text(header, x + i * width / headers.length, y, {
            width: width / headers.length,
            align: 'center'
        });
    });

   
    doc.moveDown();

  
    rows.forEach((row, i) => {
        const rowY = y + headerHeight + (i + 1) * rowHeight;
        row.forEach((cell, j) => {
           
            const cellWidth = width / headers.length;

          
            if (headers[j] === 'Email') {
                doc.text(cell.toString(), x + j * cellWidth + cellPadding, rowY, {
                    width: cellWidth * 1.5  - 2 * cellPadding, 
                    align: 'center'
                });
            } else {
                doc.text(cell.toString(), x + j * cellWidth + cellPadding, rowY, {
                    width: cellWidth - 2 * cellPadding, 
                    align: 'center'
                });
            }
        });
    });
}


module.exports = {
    salesReportGet,
    filterSalesReportbyDate,
    filteringDateRange,
    genaratePDF
}