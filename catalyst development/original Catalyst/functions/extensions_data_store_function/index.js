"use strict";
const request = require("request");
const express = require("express");
const catalyst = require("zcatalyst-sdk-node");
const app = express();
app.use(express.json());
let config = {
	search: "Iddetails",
	search_table_columns: {
		Signzykey: ["signzydata"],
	},
  };
  const Signzykey = //{Your Table name}; Replace your table name

app.post("/database", async (req, res) => {

   //**get database values */

	const customer_id = req.body.customers_id;
	//const usedquota=req.body.usedquota;
	const extension_name = req.body.extension;
  //  const customer_id = req.body.customers_id;
    const product = req.body.product_name;
    const pemailid = req.body.pemailid;
    const semailid = req.body.Semailid;
    const subscriptionType = req.body.subscriptionType;
    const redirectUrlValue = req.body.redirectURL;
	const apilim= req.body.apilimit;
	
	console.log("apilim ",apilim);
    var today = new Date();
    console.log("actualdate", today);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    const today11 = yyyy + "-" + mm + "-" + dd;
    const dateandtime =
      today11 +
      today.getHours() +
      ":" +
      today.getMinutes() +
      ":" +
      today.getSeconds();
    console.log(today11);
    console.log(dateandtime);
    const tomorrow = new Date();
	
    if (subscriptionType === "Paid") {

          if (typeof apilim !== 'undefined') {
var APItotl=apilim
console.log("APItotl ",APItotl);

	 }
	 else{
var APItotl=1000
	}


      tomorrow.setDate(today.getDate() + 30);
      var apicount = APItotl;
      var subtype = true;
    }
	 else if (subscriptionType === "Trail") {
		  if (typeof apilim !== 'undefined') {
var APItotl=apilim

	 }
	 else{
var APItotl=20
	 }
      tomorrow.setDate(today.getDate() + 10);
      var apicount = APItotl;
      var subtype = false;
    } else if (subscriptionType === "Uninstall") {
      tomorrow.setDate(today.getDate());
      var subtype = false;
      var apicount = 0;
    }
    console.log("subscription_type", subscriptionType);
    console.log("tomorrow", tomorrow);
    var dd = String(tomorrow.getDate()).padStart(2, "0");
    var mm = String(tomorrow.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = tomorrow.getFullYear();
    const quotaenddate = yyyy + "-" + mm + "-" + dd;





//**end database values */



	//** search candidate id */
	let config2 = {
		search: customer_id,
		search_table_columns: {
			CustomerDetails: ["CustomerId"],
		},
	  };

	  var catalystApp = catalyst.initialize(req);
    let datastore = catalystApp.datastore();
    let search = catalystApp.search();
    let searchPromise2 = search.executeSearchQuery(config2);
    searchPromise2.then((searchResult) => {

		let actualdata2 = JSON.stringify(searchResult);
		let actualdata3 = JSON.parse(actualdata2);
		// console.log(actualdata3.Customerdetails);
		let customer_details = actualdata3.CustomerDetails;

		if (customer_details == undefined) {
			let insertdata = {
				ProductName: product,
			 CustomerId: customer_id,
			 ZohoExtensionName: extension_name,
			 PrimaryEmail: pemailid,
			 SecondaryEmail: semailid,
			 Quota: apicount,
			 UsedQuota: 0,
			 RemainingBalance: apicount,
			 QuotaStartDate: today11,
			 QuotaEndDate: quotaenddate,
			 Subscription: subscriptionType,
			 RedirectUrl: redirectUrlValue,
			};
			let table = datastore.table("CustomerDetails");
			let insertPromise = table.insertRow(insertdata);
			insertPromise
			  .then((row) => {
				let datares = {
				  sucess_message: "The records are created sucessfully",
				  row,
				};
				res.status(200).send(datares);
			  })
			  .catch((e) => {
				console.log(e);
				res.status(500).send(e);
			  });
			
		  } else if (customer_details != undefined) {
			let rowidtoupdate = customer_details[0].ROWID;
			let updatedata = {
				ProductName: product,
				CustomerId: customer_id,
				ZohoExtensionName: extension_name,
				PrimaryEmail: pemailid,
				SecondaryEmail: semailid,
				Quota: apicount,
				UsedQuota: 0,
				RemainingBalance: apicount,
				QuotaStartDate: today11,
				QuotaEndDate: quotaenddate,
				Subscription: subscriptionType,
				RedirectUrl: redirectUrlValue,
			   ROWID: rowidtoupdate,
			};
			console.log(updatedata);
			let table3 = datastore.table("CustomerDetails");
			let rowPromise = table3.updateRow(updatedata);
			rowPromise
			  .then((row) => {
				let response = {
				  sucess_message: "The records are modified sucessfully",
				  row,
				};
				res.status(200).send(response);
			  })
			  .catch((e) => {
				console.log(e);
				res.status(500).send(e);
			  });
			console.log("updated");
		  }


	});

})



app.post("/emailvalidation",(req,res)=>{
	// let body = req.body;
	// var email =body.email
    // console.log('body is:' + email);
    //**get data */
	const email = req.body.email;
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Email Validation for Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {
							var options = {
		method: "GET",
		url:
		  "https://api.bouncify.io/v1/verify?apikey=21yxnxv6592p9ukdwu5c5lmgiqxn1w1d&email="+email,
		  
		headers: {
		  Accept: "*/*",
		  "Accept-Language": "en-US,en;q=0.8",
		  "accept": "application/json",
		  "content-type": "application/json",
		},
		
		json: true,
	  };
	  request(options, function (error, response) {
		if (error) throw new Error(error);
		const details = response;
		// const bodyresult1 = responseofgst.result;
		  console.log(details);
		  var body =details.body;
		  const data = {
			body:body,
		  Remaining_balance: remainbalance,
		  Actual_quota: availableapi,
		  Used_quota: usedcountofapi,
		  }
		  res.status(200).send(data)
	  });
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	
});

app.post("/bank", async (req, res) => {

	const bank_account = req.body.bank_account_number;
	const ifsc=req.body.ifsc;
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Bank Verification for Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {

							let searchPromise = search.executeSearchQuery(config);
							searchPromise.then((searchResult) => {
							  let actualdata = JSON.stringify(searchResult);
							  let actualdata1 = JSON.parse(actualdata);
							  let asa = actualdata1["Signzykey"];
							  let id_of_user = asa[0].id;
							  let user_id1 = asa[0].UserID;
                                     
							  const options = {
								method: "POST",
								url:
								  "https://signzy.tech/api/v2/patrons/"+user_id1+"/bankaccountverifications",
								headers: {
								  "Accept-Language": "en-US,en;q=0.8",
								  "content-type": "application/json",
								  Accept: "*/*",
								  Authorization: id_of_user,
								},
								body: {
									"task" : "bankTransfer",
									"essentials": {
									"beneficiaryAccount": bank_account,
								   "beneficiaryIFSC": ifsc
								   }
								},
								json: true,
							  };
		  

							  request(options, function (error, response) {
								if (error) throw new Error(error);
								const details = response;
								// const bodyresult1 = responseofgst.result;
								  console.log(details);
								  var body =details.body;
								  const data = {
									body:body,
								  Remaining_balance: remainbalance,
								  Actual_quota: availableapi,
								  Used_quota: usedcountofapi,
								  }
								  res.status(200).send(data)
							  });

							})


	// 						var options = {
	// 	method: "GET",
	// 	url:
	// 	  "https://api.bouncify.io/v1/verify?apikey=21yxnxv6592p9ukdwu5c5lmgiqxn1w1d&email="+email,
		  
	// 	headers: {
	// 	  Accept: "*/*",
	// 	  "Accept-Language": "en-US,en;q=0.8",
	// 	  "accept": "application/json",
	// 	  "content-type": "application/json",
	// 	},
		
	// 	json: true,
	//   };
	
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	
});

app.post("/aadhaar",(req,res)=>{
  
	//res.status(200).send("aadhar");

	const aadhar_number = req.body.aadhar_number;
	
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Aadhaar verification for Zoho Recruit",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {

							let searchPromise = search.executeSearchQuery(config);
							searchPromise.then((searchResult) => {
							  let actualdata = JSON.stringify(searchResult);
							  let actualdata1 = JSON.parse(actualdata);
							  let asa = actualdata1["Signzykey"];
							  let id_of_user = asa[0].id;
							  let user_id1 = asa[0].UserID;

                                   //**Identify addar */
								   const options1 = {
									method: "POST",
									url:
									  "https://signzy.tech/api/v2/patrons/"+user_id1+"/identities",
									headers: {
									  "Accept-Language": "en-US,en;q=0.8",
									  "content-type": "application/json",
									  Accept: "*/*",
									  Authorization: id_of_user,
									},
									body: {
									  type: "aadhaar",
									  callbackUrl: "https://www.google.com",
									  email: "support.extensions@nexivo.co",
									  images: [],
									},
									json: true,
								  };

								  request(options1, function (error, response, body) {
									let accesstoken = body.accessToken;
									let id = body.id;
									let patronid = body.patronId;

								   //**end identify */



                                     
							  const options = {
								method: "POST",
								url:
								  "https://signzy.tech/api/v2/snoops",
								headers: {
									"Accept": "*/*",
									"Accept-Language": "en-US,en;q=0.8",
									"content-type": "application/json"
								},
								body: {
									"service": "Identity",
									"itemId": id,
									"accessToken": accesstoken,
									"task": "verifyAadhaar",
									"essentials": {
										"uid": aadhar_number
									}
								},
								json: true,
							  };
		  

							  request(options, function (error, response) {
								if (error) throw new Error(error);
								const details = response;
								// const bodyresult1 = responseofgst.result;
								  console.log(details);
								  var body =details.body;
								  const data = {
									body:body,
								  Remaining_balance: remainbalance,
								  Actual_quota: availableapi,
								  Used_quota: usedcountofapi,
								  }
								  res.status(200).send(data)
							  });



							});

							})


	
	
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	

});
app.post("/businessPan",(req,res)=>{
  
	//res.status(200).send("aadhar");

	const businessPan = req.body.businessPan;
	
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "BusinessPan verification for Zoho Recruit",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {

							let searchPromise = search.executeSearchQuery(config);
							searchPromise.then((searchResult) => {
							  let actualdata = JSON.stringify(searchResult);
							  let actualdata1 = JSON.parse(actualdata);
							  let asa = actualdata1["Signzykey"];
							  let id_of_user = asa[0].id;
							  let user_id1 = asa[0].UserID;

                                   //**Identify addar */
								   const options1 = {
									method: "POST",
									url:
									  "https://signzy.tech/api/v2/patrons/"+user_id1+"/identities",
									headers: {
									  "Accept-Language": "en-US,en;q=0.8",
									  "content-type": "application/json",
									  Accept: "*/*",
									  Authorization: id_of_user,
									},
									body: {
									  type: "businessPan",
									  callbackUrl: "https://www.google.com",
									  email: "support.extensions@nexivo.co",
									  images: [],
									},
									json: true,
								  };

								  request(options1, function (error, response, body) {
									let accesstoken = body.accessToken;
									let id = body.id;
									let patronid = body.patronId;

								   //**end identify */



                                     
							  const options = {
								method: "POST",
								url:
								  "https://signzy.tech/api/v2/snoops",
								headers: {
									"Accept": "*/*",
									"Accept-Language": "en-US,en;q=0.8",
									"content-type": "application/json"
								},
								body: {
									"service":"Identity",
									"itemId":id,
									"task":"fetch",
									"accessToken":accesstoken,
									"essentials":{
										"number":businessPan
									  }
									
								},
								json: true,
							  };
		  

							  request(options, function (error, response) {
								if (error) throw new Error(error);
								const details = response;
								// const bodyresult1 = responseofgst.result;
								  console.log(details);
								  var body =details.body;
								  const data = {
									body:body,
								  Remaining_balance: remainbalance,
								  Actual_quota: availableapi,
								  Used_quota: usedcountofapi,
								  }
								  res.status(200).send(data)
							  });



							});

							})


	
	
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	

});
app.post("/domainverification", async (req, res) => {

	const webDomain = req.body.webDomain;
	
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Domain Verification for Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {

							let searchPromise = search.executeSearchQuery(config);
							searchPromise.then((searchResult) => {
							  let actualdata = JSON.stringify(searchResult);
							  let actualdata1 = JSON.parse(actualdata);
							  let asa = actualdata1["Signzykey"];
							  let id_of_user = asa[0].id;
							  let user_id1 = asa[0].UserID;
                                     
							  const options = {
								method: "POST",
								url:
								  "https://signzy.tech/api/v2/patrons/"+user_id1+"/domainverifications",
								headers: {
								  "Accept-Language": "en-US,en;q=0.8",
								  "content-type": "application/json",
								  Accept: "*/*",
								  Authorization: id_of_user,
								},
								body: {
									"essentials": {
									"webDomain":webDomain
								   }
								},
								json: true,
							  };
		  

							  request(options, function (error, response) {
								if (error) throw new Error(error);
								const details = response;
								// const bodyresult1 = responseofgst.result;
								  console.log(details);
								  var body =details.body;
								  const data = {
									body:body,
								  Remaining_balance: remainbalance,
								  Actual_quota: availableapi,
								  Used_quota: usedcountofapi,
								  }
								  res.status(200).send(data)
							  });

							})


	// 						var options = {
	// 	method: "GET",
	// 	url:
	// 	  "https://api.bouncify.io/v1/verify?apikey=21yxnxv6592p9ukdwu5c5lmgiqxn1w1d&email="+email,
		  
	// 	headers: {
	// 	  Accept: "*/*",
	// 	  "Accept-Language": "en-US,en;q=0.8",
	// 	  "accept": "application/json",
	// 	  "content-type": "application/json",
	// 	},
		
	// 	json: true,
	//   };
	
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	
});
app.post("/validpassport",(req,res)=>{
	//res.status(200).send("aadhar");

	const filenumber = req.body.filenumber;
	const dob = req.body.dob;
	const pname = req.body.pname;
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Passport verification for Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {

							let searchPromise = search.executeSearchQuery(config);
							searchPromise.then((searchResult) => {
							  let actualdata = JSON.stringify(searchResult);
							  let actualdata1 = JSON.parse(actualdata);
							  let asa = actualdata1["Signzykey"];
							  let id_of_user = asa[0].id;
							  let user_id1 = asa[0].UserID;

                                   //**Identify addar */
								   const options1 = {
									method: "POST",
									url:
									  "https://signzy.tech/api/v2/patrons/"+user_id1+"/identities",
									headers: {
									  "Accept-Language": "en-US,en;q=0.8",
									  "content-type": "application/json",
									  Accept: "*/*",
									  Authorization: id_of_user,
									},
									body: {
									  type: "passport",
									  callbackUrl: "https://www.google.com",
									  email: "support.extensions@nexivo.co",
									  images: [],
									},
									json: true,
								  };

								  request(options1, function (error, response, body) {
									let accesstoken = body.accessToken;
									let id = body.id;
									let patronid = body.patronId;

								   //**end identify */



                                     
							  const options = {
								method: "POST",
								url:
								  "https://signzy.tech/api/v2/snoops",
								headers: {
									"Accept": "*/*",
									"Accept-Language": "en-US,en;q=0.8",
									"content-type": "application/json"
								},
								body: {
									"service": "Identity",
									"itemId": id,
									"accessToken": accesstoken,
									"task": "verification",
									"essentials": {
										"fileNumber": filenumber,
										"dob": dob,
										"name": pname,
										"fuzzy": "true/false"
									}
								},
								json: true,
							  };
		  

							  request(options, function (error, response) {
								if (error) throw new Error(error);
								const details = response;
								// const bodyresult1 = responseofgst.result;
								  console.log(details);
								  var body =details.body;
								  const data = {
									body:body,
								  Remaining_balance: remainbalance,
								  Actual_quota: availableapi,
								  Used_quota: usedcountofapi,
								  }
								  res.status(200).send(data)
							  });



							});

							})


	
	
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
});
app.post("/vehicle",(req,res)=>{
	//res.status(200).send("aadhar");

	const vehicleNumber = req.body.vehicleNumber;
//	res.status(200).send(vehicleNumber);
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) { 
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Vehicleregistrations Verification for Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {

							let searchPromise = search.executeSearchQuery(config);
							searchPromise.then((searchResult) => {
							  let actualdata = JSON.stringify(searchResult);
							  let actualdata1 = JSON.parse(actualdata);
							  let asa = actualdata1["Signzykey"];
							  let id_of_user = asa[0].id;
							  let user_id1 = asa[0].UserID;

                                     
							  const options = {
								method: "POST",
								url:
								  "https://signzy.tech/api/v2/patrons/"+user_id1+"/vehicleregistrations",
								headers: {
									"Accept": "*/*",
									"Accept-Language": "en-US,en;q=0.8",
									"content-type": "application/json",
									"Authorization":id_of_user
								},
								body: {
									"task": "detailedSearch",
                                      "essentials": {
                                    "vehicleNumber": vehicleNumber
                                        }
								},
								json: true,
							  };
		  

							  request(options, function (error, response) {
								if (error) throw new Error(error);
								const details = response;
								// const bodyresult1 = responseofgst.result;
								  console.log(details);
								  var body =details.body;
								  const data = {
									body:body,
								  Remaining_balance: remainbalance,
								  Actual_quota: availableapi,
								  Used_quota: usedcountofapi,
								  }
								  res.status(200).send(data)
							  });



							

							})


	
	
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});

});
app.post("/compantgst",(req,res)=>{
	//res.status(200).send("aadhar");

	const companyName = req.body.companyName;
//	res.status(200).send(vehicleNumber);
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Company GST Finder for Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {

							let searchPromise = search.executeSearchQuery(config);
							searchPromise.then((searchResult) => {
							  let actualdata = JSON.stringify(searchResult);
							  let actualdata1 = JSON.parse(actualdata);
							  let asa = actualdata1["Signzykey"];
							  let id_of_user = asa[0].id;
							  let user_id1 = asa[0].UserID;

                                     
							  const options = {
								method: "POST",
								url:
								  "https://signzy.tech/api/v2/patrons/"+user_id1+"/gstns",
								headers: {
									"Accept": "*/*",
									"Accept-Language": "en-US,en;q=0.8",
									"content-type": "application/json",
									"Authorization":id_of_user
								},
								body: {
									"task": "companyNameToGst",
                                     "essentials": {
                                     "companyName": companyName
                                        }
								},
								json: true,
							  };
		  

							  request(options, function (error, response) {
								if (error) throw new Error(error);
								const details = response;
								// const bodyresult1 = responseofgst.result;
								  console.log(details);
								  var body =details.body;
								  const data = {
									body:body,
								  Remaining_balance: remainbalance,
								  Actual_quota: availableapi,
								  Used_quota: usedcountofapi,
								  }
								  res.status(200).send(data)
							  });



							

							})


	
	
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});

});
app.post("/videoverification",(req,res)=>{
	//res.status(200).send("aadhar");

	const images = req.body.images;
	const callbackUrl = req.body.callbackUrl;
//	res.status(200).send(vehicleNumber);
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Video Verification for Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {

							let searchPromise = search.executeSearchQuery(config);
							searchPromise.then((searchResult) => {
							  let actualdata = JSON.stringify(searchResult);
							  let actualdata1 = JSON.parse(actualdata);
							  let asa = actualdata1["Signzykey"];
							  let id_of_user = asa[0].id;
							  let user_id1 = asa[0].UserID;

                                     
							  const options = {
								method: "POST",
								url:
								  "https://signzy.tech/api/v2/patrons/"+user_id1+"/videoiframes",
								headers: {
									"Accept": "*/*",
									"Accept-Language": "en-US,en;q=0.8",
									"content-type": "application/json",
									"Authorization":id_of_user
								},
								body: {
									"task" : "url",
									"essentials" : {
										"matchImage" : images,
										"customVideoRecordTime": "10",
										"hideTopLogo":"true",
										"hideBottomLogo":"true",
										"callbackUrl" : callbackUrl,
										"idCardVerification":"true",
									}
								},
								json: true,
							  };
		  

							  request(options, function (error, response) {
								if (error) throw new Error(error);
								const details = response;
								// const bodyresult1 = responseofgst.result;
								  console.log(details);
								  var body =details.body;
								  const data = {
									body:body,
								  Remaining_balance: remainbalance,
								  Actual_quota: availableapi,
								  Used_quota: usedcountofapi,
								  }
								  res.status(200).send(data)
							  });



							

							})


	
	
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});

});
app.post("/exchangerates24hrs",(req,res)=>{
	// let body = req.body;
	// var email =body.email
    // console.log('body is:' + email);
    //**get data */
	const Base_currency_code = req.body.Base_currency_code;
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "24 Hourly Exchange Rate Update For Zoho Books",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {
							var options = {
		method: "GET",
		url:
		  "https://openexchangerates.org/api/latest.json?app_id=0ee7a8a4cced47a8b15cb49697f63e66&base="+Base_currency_code,
		  
		headers: {
		  Accept: "*/*",
		  "Accept-Language": "en-US,en;q=0.8",
		  "accept": "application/json",
		  "content-type": "application/json",
		},
		
		json: true,
	  };
	  request(options, function (error, response) {
		if (error) throw new Error(error);
		const details = response;
		// const bodyresult1 = responseofgst.result;
		  console.log(details);
		  var body =details.body;
		  const data = {
			body:body,
		  Remaining_balance: remainbalance,
		  Actual_quota: availableapi,
		  Used_quota: usedcountofapi,
		  }
		  res.status(200).send(data)
	  });
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	






//**end data**//




});
app.post("/autoexchangerate",(req,res)=>{
	// let body = req.body;
	// var email =body.email
    // console.log('body is:' + email);
    //**get data */
	const Base_currency_code = req.body.Base_currency_code;
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Auto Update Exchange Rate For Zoho Books",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {
							var options = {
		method: "GET",
		url:
		  "https://exchange-rates.abstractapi.com/v1/live/?api_key=b6e801086a034af68fcf8557f8264d82&base="+Base_currency_code,
		  
		headers: {
		  Accept: "*/*",
		  "Accept-Language": "en-US,en;q=0.8",
		  "accept": "application/json",
		  "content-type": "application/json",
		},
		
		json: true,
	  };
	  request(options, function (error, response) {
		if (error) throw new Error(error);
		const details = response;
		// const bodyresult1 = responseofgst.result;
		  console.log(details);
		  var body =details.body;
		  const data = {
			body:body,
		  Remaining_balance: remainbalance,
		  Actual_quota: availableapi,
		  Used_quota: usedcountofapi,
		  }
		  res.status(200).send(data)
	  });
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	






//**end data**//
	



});
app.post("/iban",(req,res)=>{
	// let body = req.body;
	// var email =body.email
    // console.log('body is:' + email);
    //**get data */
	const IBAN = req.body.IBAN;
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "IBAN Insight for Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {
							var options = {
		method: "GET",
		url:
		  "https://api.apilayer.com/bank_data/iban_validate?iban_number="+IBAN,
		  
		headers: {
			"apikey":"AIvhQobzBNDqsV3pPk9AEB3tRHvGO8EW"
		},
		
		json: true,
	  };
	  request(options, function (error, response) {
		if (error) throw new Error(error);
		const details = response;
		// const bodyresult1 = responseofgst.result;
		  console.log(details);
		  var body =details.body;
		  const data = {
			body:body,
		  Remaining_balance: remainbalance,
		  Actual_quota: availableapi,
		  Used_quota: usedcountofapi,
		  }
		  res.status(200).send(data)
	  });
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	






//**end data**//
	

	// var options = {
	// 	method: "GET",
	// 	url:
	// 	  "https://api.bouncify.io/v1/verify?apikey=21yxnxv6592p9ukdwu5c5lmgiqxn1w1d&email="+email,
		  
	// 	headers: {
	// 	  Accept: "*/*",
	// 	  "Accept-Language": "en-US,en;q=0.8",
	// 	  "accept": "application/json",
	// 	  "content-type": "application/json",
	// 	},
		
	// 	json: true,
	//   };
	//   request(options, function (error, response) {
	// 	if (error) throw new Error(error);
	// 	const details = response;
	// 	// const bodyresult1 = responseofgst.result;
	// 	  console.log(details);
	// 	  var body =details.body;
	// 	  res.status(200).send(body)
	//   });



});
app.post("/emailbouncify",(req,res)=>{
	// let body = req.body;
	// var email =body.email
    // console.log('body is:' + email);
    //**get data */
	const email = req.body.email;
	const extension_name = req.body.extension_name;
	const clientid = req.body.customers_id;
	const pemailid = req.body.primary_email;
	const semailid = req.body.secondary_email;
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
	var yyyy = today.getFullYear();
	const today11 = yyyy + "-" + mm + "-" + dd;
	const dateandtime =
	  today11 +
	  " " +
	  today.getHours() +
	  ":" +
	  today.getMinutes() +
	  ":" +
	  today.getSeconds();
	console.log(today11);
	console.log(dateandtime);
	var catalystApp = catalyst.initialize(req);
	let query =
	  "SELECT Quota,UsedQuota,RemainingBalance,ROWID FROM CustomerDetails WHERE CustomerId =" +
	  clientid;
	let zcql = catalystApp.zcql();
	let zcqlPromise = zcql.executeZCQLQuery(query);
	zcqlPromise.then((queryResult) => {
		let zcsearchvalue = queryResult;
		console.log("zdata",zcsearchvalue[0]);

		if (zcsearchvalue[0] != undefined) {
			console.log(zcsearchvalue[0].CustomerDetails.RemainingBalance);
			// let datastore = catalystApp.datastore();
			let search = catalystApp.search();
			let datastore = catalystApp.datastore();
			let rowidupdatevalue = zcsearchvalue[0].CustomerDetails.ROWID;
			let availableapi = zcsearchvalue[0].CustomerDetails.Quota;
			let remainingapi = zcsearchvalue[0].CustomerDetails.RemainingBalance;
			let usedapiquota = zcsearchvalue[0].CustomerDetails.UsedQuota;
			console.log("remaining balance", remainingapi);
			console.log("used api", usedapiquota);
			console.log("rowid", rowidupdatevalue);
			//res.status(200).send(remainingapi)
			if (remainingapi > 0) {
				let insertlog123 = {
					CustomerId: clientid,
					ExtensionName: extension_name,
					ApiName: "Email Validation for Bigin by Zoho CRM",
					APITimestamp: dateandtime,
					PrimaryEmail: pemailid,
					SecondaryEmail: semailid,
				};
				console.log(insertlog123);
				let table342 = datastore.table("LogExtensions");
				let insertPromise123 = table342.insertRow(insertlog123);
				insertPromise123
                .then((row) => {
					let updatedsucessdata33 = {
					  sucess_message: "The records are created sucessfully",
					  row,
					};
					let usedcountofapi = parseInt(usedapiquota) + 1;
					let remainbalance = parseInt(availableapi) - parseInt(usedcountofapi);

					let sucessapiupdate = {
						UsedQuota: usedcountofapi,
						RemainingBalance:
						parseInt(availableapi) - parseInt(usedcountofapi),
					  ROWID: rowidupdatevalue,
					};
					console.log(sucessapiupdate);
					let table77 = datastore.table("CustomerDetails");
					let rowPromise = table77.updateRow(sucessapiupdate);
					rowPromise
					  .then((row) => {
						let updatedsucessdata = {
						  sucess_message: "The records are modified sucessfully",
						  row,
						};
						if (row != undefined) {
							var options = {
		method: "GET",
		url:
		  "https://api.bouncify.io/v1/verify?apikey=21yxnxv6592p9ukdwu5c5lmgiqxn1w1d&email="+email,
		  
		headers: {
			"Accept":"application/json"
		},
		json: true,
	  };
	  request(options, function (error, response) {
		if (error) throw new Error(error);
		const details = response;
		// const bodyresult1 = responseofgst.result;
		  console.log(details);
		  var body =details.body;
		  const data = {
			body:body,
		  Remaining_balance: remainbalance,
		  Actual_quota: availableapi,
		  Used_quota: usedcountofapi,
		  }
		  res.status(200).send(data)
	  });
						 
					} 
					else {
						  res.status(500).send({
							error: {
							  code: 143,
							  message: "database is not in service",
							},
						  });
						}
					  })
					  .catch((e) => {
						console.log(e);
						res.status(500).send(e);
					  });
				  })
				  .catch((e) => {
					console.log(e);
					res.status(500).send(e);
				  });

			}
			else {
				res.status(500).send({
				  error: {
					code: 234,
					message: "You have consumed 100% of the API",
				  },
				});
			  }


		}
		else {
			res.status(500).send({
			  error: {
				code: 133,
				message: "The disposed clientid is invalid",
			  },
			});
		  }





	});
	






//**end data**//
	

	// var options = {
	// 	method: "GET",
	// 	url:
	// 	  "https://api.bouncify.io/v1/verify?apikey=21yxnxv6592p9ukdwu5c5lmgiqxn1w1d&email="+email,
		  
	// 	headers: {
	// 	  Accept: "*/*",
	// 	  "Accept-Language": "en-US,en;q=0.8",
	// 	  "accept": "application/json",
	// 	  "content-type": "application/json",
	// 	},
		
	// 	json: true,
	//   };
	//   request(options, function (error, response) {
	// 	if (error) throw new Error(error);
	// 	const details = response;
	// 	// const bodyresult1 = responseofgst.result;
	// 	  console.log(details);
	// 	  var body =details.body;
	// 	  res.status(200).send(body)
	//   });



});
 


module.exports = app;