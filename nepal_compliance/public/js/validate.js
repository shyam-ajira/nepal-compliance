function validate_field_value(frm, field_name) {
    var field_value = frm.doc[field_name];
    
    if (field_value) {
        var field_value_str = field_value.toString(); 
        if (field_value_str.length !== 9 || isNaN(field_value_str)) {
            frappe.throw(frappe._('The field {0} must be exactly 9 digits and should be a valid VAT/PAN Number.', [field_name]));
            frappe.validated = false; 
            return true;
        }
    }
    return false;
}

function validate_field(frm) {
    var tax_id = frm.doc.tax_id ? frm.doc.tax_id.toString().trim() : '';
    var tax_id = frm.doc.tax_id ? frm.doc.tax_id.toString().trim() : '';
    var tax_id = frm.doc.tax_id ? frm.doc.tax_id.toString().trim() : '';

    if (tax_id && ((tax_id && tax_id === tax_id) || (tax_id && tax_id === tax_id))) {
        frappe.throw(__('Supplier VAT/PAN Number and Customer VAT/PAN Number should not be the same.'));
        frappe.validated = false; 
        return;
    }
    if (validate_field_value(frm, 'tax_id') || validate_field_value(frm, 'tax_id') || validate_field_value(frm, 'tax_id')) {
        return; 
    }
}

// function fetch_tax_id(frm, doc_type, field_name) {
//     var doc_field = (doc_type === "Supplier" || doc_type === "Customer") ? doc_type.toLowerCase() : 'company';
//     // var field_map = doc_type === "Supplier" ? 'tax_id' : (doc_type === "Customer" ? 'tax_id' : 'company_tax_id');
    
//     if (frm.doc[doc_field] && !frm.doc[field_name]) {
//         frappe.db.get_value(doc_type, frm.doc[doc_field], field_map, function(value) {
//             if (value && value[field_map]) {
//                 frm.set_value(field_name, value[field_map]);
//             }
//         });
//     }
// }

frappe.ui.form.on("Sales Invoice", {
    validate: function(frm) {
        validate_field(frm);
    },
    customer: function(frm) {
        fetch_tax_id(frm, 'Customer', 'tax_id');
    },
    onload: function(frm){
        fetch_tax_id(frm, 'Company', 'tax_id');
    }
});

frappe.ui.form.on("Purchase Invoice", {
    validate: function(frm) {
        validate_field(frm);
    },
    supplier: function(frm) {
        fetch_tax_id(frm, 'Supplier', 'tax_id');
    },
    onload: function(frm){
        fetch_tax_id(frm, 'Company', 'tax_id');
    }
});

// frappe.ui.form.on("Company", {
//     validate: function(frm) {
//         validate_field_value(frm, 'company_tax_id');
//     }
// });

frappe.ui.form.on("Supplier", {
    validate: function(frm) {
        validate_field_value(frm, 'tax_id');
    }
});

frappe.ui.form.on("Customer", {
    validate: function(frm) {
        validate_field_value(frm, 'tax_id');
    }
});