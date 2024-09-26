sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";

	return Controller.extend("fsm.connector.activity.ext.ActivityAddress", {
		onInit: function () {
			this.getView().byId("CoordinationForm").setVisible(false);
		},
		onChange: function (oEvent) {
			let sSelectedType = oEvent
				.getParameter("selectedItem")
				.getProperty("key");
			let sBindingContext = oEvent
				.getParameter("selectedItem")
				.getBindingContext();

			if (sSelectedType === "G") {
				this.getView().byId("AddressForm").setVisible(false);
				this.getView().byId("CoordinationForm").setVisible(true);
				this.getView()
					.byId("CoordinationForm")
					.setBindingContext(sBindingContext);
			} else {
				this.getView().byId("AddressForm").setVisible(true);
				this.getView().byId("CoordinationForm").setVisible(false);
				this.getView().byId("AddressForm").setBindingContext(sBindingContext);
			}
		},
	});
});
