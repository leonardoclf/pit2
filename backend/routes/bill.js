const express = require('express')
const connection = require('../connection')
const router = express.Router();
let ejs = require('ejs');
let pdf = require('html-pdf');
let path = require('path');
var fs = require('fs');
var uuid = require('uuid');
var auth = require('../services/authentication')

router.post('/generateReport', auth.authenticateToken, (req, res) => {
    const generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails);

    var query = "insert into bill (name, uuid, email, contactNumber, paymentMethod, total, productDetails, createdBy) values (?,?,?,?,?,?,?,?)";
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAumont, orderDetails.productDetails, res.locals.email], (err, results) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAumont: orderDetails.totalAumont }, (err, html) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json(err);
                } else {
                    pdf.create(html).toFile('./generated_pdf/' + generatedUuid + ".pdf", function (err, data) {
                        if (err) {
                            return res.status(500).json(err);
                        } else {
                            return res.status(200).json({ uuid: generatedUuid });
                        }
                    });
                }
            });
        } else {
            return res.status(500).json(err);
        }
    });
});

router.post('/getPdf', auth.authenticateToken, function (req, res) {
    const orderDetails = req.body;
    const pdfPath = './generated_pdf/' + orderDetails.uuid + '.pdf';
    if (fs.existsSync(pdfPath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfPath).pipe(res);
    } else {
        var productDetails = JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productDetails, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAumont: orderDetails.totalAumont }, (err, html) => {
            if (err) {
                return res.status(500).json(err);
            } else {
                pdf.create(html).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function (err, data) {
                    if (err) {
                        console.log(err);
                        return res.status(500).json(err);
                    } else {
                        res.contentType("application/pdf");
                        fs.createReadStream(pdfPath).pipe(res);
                    }
                });
            }
        });
    }
});

router.get('/getBills', auth.authenticateToken, (req,res,next) => {
    var query = "select * from bill order by id desc"
    connection.query(query, (err,results) =>{
        if(!err) {
            return res.status(200).json(results)
        }
        else {
            return res.status(500).json(err);
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, (req,res,next) => {
    console.log('aqui');
    console.log(req)
    const id = req.params.id;
    var query = "delete from bill where id = ?";
    console.log(query);
    connection.query(query,[id], (err, results) => {
        if(!err) {
            if (results.affectedRows == 0) {
                return res.status(404).json({message : "Compra não encontrado"})
            }
            return res.status(200).json({message: "Compra deletada corretamente"})
        }
        else {
            return res.status(500).json(err);
        }
    })
})


module.exports = router;
