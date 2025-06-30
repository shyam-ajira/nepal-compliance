var allow_duplicate_taxid = false; // Set to true if you want to allow duplicates
function validate_taxid(frm, taxid) {
    
    if (taxid) {
        var taxid_str = taxid.toString(); 
        if (taxid_str.length !== 9 || isNaN(taxid_str)) {
            frappe.throw(frappe._('Tax ID must be a valid PAN/VAT number and exactly 9 digits.'));
            frappe.validated = false; 
            return true;
        }
    }
    return false;
}

function validate_unique_taxid(frm, taxid, dt) {
    if (!taxid){
        console.log ('Tax ID is empty, skipping validation.');
        return false;
    }
   
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: dt,
            fields: ["name"],
            filters: [
                ["tax_id", "=", taxid],
                ["name", "!=", frm.doc.name] 
            ],
            limit_page_length: 1
        },
        async: false, 
        callback: function(r) {
            if (r.message && r.message.length > 0) {
                frappe.validated = false;
                frappe.msgprint(__('Another Supplier with the same Tax ID already exists.'));
                return false; // Validation failed, duplicate found
            }
            return true; // Validation passed, no duplicates found
        }
    });
}

frappe.ui.form.on("Company", {
    validate: function(frm) {
        validate_taxid(frm, frm.doc.tax_id);
    }
});

frappe.ui.form.on('Supplier', {
    validate: function(frm) {
        validate_taxid(frm, frm.doc.tax_id);
        if (frm.doc.allow_duplicate_taxid == 0) 
            if (!validate_unique_taxid(frm, frm.doc.tax_id, 'Supplier'))
                return false; // Stop form submission if validation fails
        return true; // Allow form submission if validation passes
    }
});


frappe.ui.form.on('Customer', {
    validate: function(frm) {
        validate_taxid(frm, frm.doc.tax_id);
        if (!allow_duplicate_taxid) validate_unique_taxid(frm, frm.doc.tax_id, 'Customer');

    }
});
