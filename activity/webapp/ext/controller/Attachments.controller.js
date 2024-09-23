sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/json/JSONModel",
		"sap/suite/ui/generic/template/extensionAPI/extensionAPI",
	],
	function (Controller, JSONModel, ExtensionAPI) {
		"use strict";

		return Controller.extend("fsm.connector.activity.ext.Attachments", {
			/**
			 * Called when a controller is instantiated and its View controls (if available) are already created.
			 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
			 * @memberOf fsm.connector.activity.ext.Attachments
			 */
			onInit: function () {
				ExtensionAPI.getExtensionAPIPromise(this.getView()).then(
					function (oExtensionAPI) {
						oExtensionAPI.attachPageDataLoaded(
							function (event) {
								this._onRouteMatched(event);
							}.bind(this)
						);
					}.bind(this)
				);
			},

			_onRouteMatched: function (oEvent) {
				let oJsonModel = new JSONModel();
				var oModel = this.getOwnerComponent().getModel();
				var sPath = oEvent.context.sPath;
				var oData = oEvent.context.getModel().getProperty(sPath);
				if (oData.ActivityNumber !== "") {
					oModel.read(
						"/Activity('" + oData.ActivityNumber + "')/toActivityAttachments",
						{
							success: function (oData, oResponse) {
								oJsonModel.setData(oData.results);
								bindModel();
							},
							error: function (oError) {
							},
						}
					);
				} else {
					oJsonModel.setData({});
					this.getView().setModel(oJsonModel, "Attachments");
				}

				const bindModel = () => {
					var oDeepData = transformTreeData(oJsonModel.getData());
					setModelData(oDeepData);
				};

				const setModelData = (nodes) => {
					//store the nodes in the JSON model, so the view can access them
					var oNodesModel = new JSONModel();
					oNodesModel.setData({ nodeRoot: { children: nodes } });
					this.getView().setModel(oNodesModel, "Attachments");
				};

				const transformTreeData = (nodesIn) => {
					var nodes = []; //'deep' object structure
					var nodeMap = {}; //'map', each node is an attribute

					if (nodesIn) {
						var nodeOut;
						var parentId;

						for (var i = 0; i < nodesIn.length; i++) {
							var nodeIn = nodesIn[i];
							nodeOut = {
								NodeID: nodeIn.NodeID,
								Description: nodeIn.Description,
								FileName: nodeIn.FileName,
								CreatedBy: nodeIn.Creator,
								CreatedOn: nodeIn.CreateDate,
								DokumentNumber: nodeIn.DokumentNumber,
								DokumentVersion: nodeIn.DokumentVersion,
								DokumentPart: nodeIn.DokumentPart,
								DokumentType: nodeIn.DokumentType,
								type: nodeIn.Type,
								children: [],
							};

							parentId = nodeIn.ParentNodeID;

							if (parentId && parentId > 0) {
								var parent = nodeMap[nodeIn.ParentNodeID];
								if (parent) {
									parent.children.push(nodeOut);
								}
							} else {
								//there is no parent, must be top level
								nodes.push(nodeOut);
							}

							//add the node to the node map, which is a simple 1-level list of all nodes
							nodeMap[nodeOut.NodeID] = nodeOut;
						}
					}
					return nodes;
				};
			},

			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf fsm.connector.activity.ext.Attachments
			 */
			//	onBeforeRendering: function() {
			//
			//	},
			/**
			 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
			 * This hook is the same one that SAPUI5 controls get after being rendered.
			 * @memberOf fsm.connector.activity.ext.Attachments
			 */
			//	onAfterRendering: function() {
			//
			//	},
			/**
			 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
			 * @memberOf fsm.connector.activity.ext.Attachments
			 */
			//	onExit: function() {
			//
			//	}
		});
	}
);
