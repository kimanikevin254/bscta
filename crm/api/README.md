# CRM

Lead Creation: When someone expresses interest, they are added as a lead. You record relevant information (name, email, company name, etc.) and track interactions like phone calls or emails.

Lead Qualification: Through interactions, you assess whether the lead is likely to become a customer. This might involve updating the leadStatus field to show stages like NEW, IN_PROGRESS, or CLOSED.

Conversion: When a lead decides to purchase or engage in a contract, they are converted to a customer.

    This conversion would involve creating a Customer record using details from the Lead record.
    A record in the Conversion History table can also be created to track this change.

Ongoing Customer Management: After conversion, you continue to track interactions through the Customer entity and can update details like status or engagement level as needed.
