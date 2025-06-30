import frappe
from dataclasses import fields
from frappe import _


def create_custom_fields():
    custom_fields = {
        "Item": [
            {"fieldname": "is_nontaxable_item", "label": "Is Non-Taxable Item", "fieldtype": "Check", "insert_after": "is_stock_item"},
        ],
        "Sales Invoice Item": [
            {"fieldname": "is_nontaxable_item", "label": "Is Non-Taxable Item", "fieldtype": "Check", "insert_after": "is_free_item", "fetch_from": "item_code.is_nontaxable_item", "read_only": 1},
        ],
        "Purchase Invoice Item": [
            {"fieldname": "is_nontaxable_item", "label": "Is Non-Taxable Item", "fieldtype": "Check", "insert_after": "is_free_item", "fetch_from": "item_code.is_nontaxable_item", "read_only": 1},
        ],
        "User": [
            {"fieldname": "use_ad_date", "label": "Use Ad Date", "fieldtype": "Check", "insert_after": "username",
            "description": "<b>Disclaimer:</b> Checking this means you prefer using the default date picker (AD format) as your preferred format."},
        ],
        "Employee": [
            {"fieldname": "revised_salary", "label": "Revised Salary", "fieldtype": "Currency", "insert_after": "payroll_cost_center", "reqd": 1},
        ],
        "Salary Slip": [
            {"fieldname": "taxable_salary", "label": "Taxable Salary", "fieldtype": "Currency", "insert_after": "total_deduction"},
        ],
        "Purchase Invoice":[
            {"fieldname": "nepali_date", "label": "Nepali Date", "fieldtype": "Data", "insert_after": "posting_date", "allow_on_submit": 1},
            {"fieldname": "qr_code", "label": "QR Code", "fieldtype": "Attach", "insert_after": "customer_tax_id", "hidden": 1, "allow_on_submit": 1}
        ],
        "Sales Invoice": [
            {"fieldname": "nepali_date", "label": "Nepali Date", "fieldtype": "Data", "insert_after": "posting_date", "allow_on_submit": 1},
            {"fieldname": "qr_code", "label": "QR Code", "fieldtype": "Attach", "insert_after": "tax_id", "hidden": 1, "allow_on_submit": 1},
            {"fieldname": "reason", "label": "Reason For Return", "fieldtype": "Data", "insert_after": "tax_id", "depends_on": "eval:doc.is_return == 1", "mandatory_depends_on": "eval:doc.is_return == 1"},
            {"fieldname": "cbms_status", "label": "CBMS Status", "fieldtype": "Select", "options": "\nSuccess\nPending\nFailed", "default": "", "insert_after": "tax_id", "in_list_view": 1, "allow_on_submit": 1},
            {"fieldname": "cbms_response", "label": "CBMS Response", "fieldtype": "Small Text", "insert_after": "cbms_status", "in_list_view": 1, "allow_on_submit": 1}
        ],
        "Supplier":[
            {"fieldname": "allow_duplicate_taxid", "label": "Allow Duplicate Tax ID?", "fieldtype": "Check", "insert_after": "tax_id", "default": 0,
             "description": "<b>Note:</b> Checking this disbles Unique PAN/VAT validation for this supplier. It is used for private firms which have same PAN/VAT number. For this to work, <b>Allow Duplicate Tax ID?</b> must be checked for all relevant parties."},
        ],
        "Customer":[
            {"fieldname": "allow_duplicate_taxid", "label": "Allow Duplicate Tax ID?", "fieldtype": "Check", "insert_after": "tax_id", "default": 0,
             "description": "<b>Note:</b> Checking this disbles Unique PAN/VAT validation for this supplier. It is used for private firms which have same PAN/VAT number. For this to work, <b>Allow Duplicate Tax ID?</b> must be checked for all relevant parties."},
        ],
        
    }

    created_fields = [] 

    for doctype_name, fields in custom_fields.items():
        for field in fields:
            if not frappe.db.exists("Custom Field", {"dt": doctype_name, "fieldname": field["fieldname"]}):
                custom_field = frappe.get_doc({
                    "doctype": "Custom Field",
                    "dt": doctype_name,
                    "module": "Nepal Compliance",
                    **field
                })
                custom_field.save()
                frappe.msgprint(_(f"Custom field '{field['label']}' added successfully to {doctype_name}!"))
                created_fields.append({"dt": doctype_name, "fieldname": field["fieldname"]})
            else:
                frappe.msgprint(_(f"Field '{field['label']}' already exists in {doctype_name}."))

    return created_fields  

create_custom_fields()