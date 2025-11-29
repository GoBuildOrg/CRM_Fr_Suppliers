/**
 * Construction Industry Knowledge Base
 * 
 * Default knowledge for construction CRM queries when no documents are uploaded.
 * This provides context about construction industry processes, CRM workflows,
 * and best practices specific to construction companies.
 */

export const constructionKnowledge = [
    {
        id: "construction_supplier_management",
        content: "Supplier Management in Construction CRM: Managing suppliers effectively is crucial for construction companies. A good CRM should track supplier contact information, product catalogs, pricing agreements, delivery schedules, and payment terms. Maintain a vendor rating system based on delivery reliability, quality, and pricing. Track purchase orders and delivery confirmations. Set up automated alerts for contract renewals and price changes. Categorize suppliers by specialty (concrete, steel, electrical, plumbing, etc.) for easy lookup.",
        category: "supplier_management"
    },
    {
        id: "construction_quotation_workflow",
        content: "Quotation Workflow in Construction: The quotation process typically follows these steps: 1) Receive project inquiry with specifications, 2) Conduct site visit and measurements if needed, 3) Calculate material costs from supplier quotes, 4) Estimate labor hours and costs, 5) Add equipment rental costs, 6) Include overhead and profit margins (typically 10-20%), 7) Create detailed BOQ (Bill of Quantities), 8) Generate professional quote with timeline, 9) Follow up within 48 hours, 10) Handle negotiations and revisions. Track quote status: Draft, Sent, Under Review, Negotiation, Accepted, or Rejected.",
        category: "quotation"
    },
    {
        id: "construction_project_lifecycle",
        content: "Construction Project Lifecycle in CRM: Track projects through these phases: Pre-Construction (feasibility, design, permits), Procurement (material ordering, supplier selection), Execution (actual construction, daily logs, progress tracking), Monitoring (quality checks, safety inspections), and Closeout (final inspection, handover, warranty documentation). Each phase should have milestone tracking, budget monitoring, and stakeholder communication logs. Use Gantt charts or Kanban boards for visual progress tracking.",
        category: "project_management"
    },
    {
        id: "construction_material_tracking",
        content: "Material Tracking Best Practices: Implement a robust material tracking system that includes: Real-time inventory levels for frequently used items (cement, steel bars, bricks, sand). Set minimum stock levels with automatic reorder alerts. Track material usage by project for accurate costing. Maintain delivery receipts and quality certificates. Use barcode or QR code scanning for warehouse management. Monitor material wastage and reconcile with estimates. Track material price fluctuations over time. Maintain preferred supplier lists for each material category.",
        category: "inventory"
    },
    {
        id: "construction_lead_management",
        content: "Lead Management for Construction Companies: Capture leads from multiple sources: website inquiries, referrals, cold calls, trade shows, and online directories. Qualify leads using BANT (Budget, Authority, Need, Timeline). Categorize by project type: Residential, Commercial, Industrial, or Infrastructure. Track lead source ROI. Set up lead scoring based on project size, timeline, and budget. Assign leads to sales team based on expertise and workload. Follow up schedule: Day 1 (immediate response), Day 3, Day 7, Day 14. Convert leads to opportunities when project scope is defined.",
        category: "leads"
    },
    {
        id: "construction_order_management",
        content: "Order Management Process: Construction orders involve multiple stages: 1) Initial order creation from approved quote, 2) Work order generation with project details, 3) Material procurement orders to suppliers, 4) Labor assignment and scheduling, 5) Equipment booking, 6) Progress billing schedules, 7) Variation orders for scope changes, 8) Payment milestone tracking, 9) Delivery and installation coordination, 10) Final completion and sign-off. Track order status, payment progress, and any change orders. Maintain order history for repeat clients.",
        category: "orders"
    },
    {
        id: "construction_customer_communication",
        content: "Customer Communication Best Practices: Maintain regular communication with clients throughout the project lifecycle. Send weekly progress reports with photos. Provide daily logs for active projects. Schedule monthly review meetings for long-term projects. Use automated SMS/email for milestone completions. Share project timelines and update on any delays promptly. Maintain a communication log in CRM for all client interactions. Provide a dedicated project manager as single point of contact. Use client portal for document sharing and approvals. Collect feedback at project completion.",
        category: "customer_relations"
    },
    {
        id: "construction_compliance_safety",
        content: "Compliance and Safety Documentation: Construction projects require extensive compliance tracking: Building permits and approvals, safety inspection reports, environmental compliance certificates, worker safety training records, equipment certification, insurance documentation, subcontractor licenses, and quality test reports. Store all compliance documents in the CRM with expiry alerts. Maintain safety incident logs and corrective action records. Track regulatory requirement changes. Generate compliance reports for audits.",
        category: "compliance"
    },
    {
        id: "construction_cost_estimation",
        content: "Cost Estimation in Construction: Accurate cost estimation is critical. Break down costs into: Direct costs (materials, labor, equipment, subcontractors), Indirect costs (site overhead, supervision, temporary facilities), and Contingency (typically 5-10% for unforeseen issues). Use historical data from previous similar projects. Factor in seasonal price variations. Include wastage factors (typically 5-10% for materials). Account for location-specific costs (transportation, local labor rates). Update cost databases quarterly. Use three-point estimation for complex projects.",
        category: "estimation"
    },
    {
        id: "construction_subcontractor_management",
        content: "Subcontractor Management: Maintain a database of qualified subcontractors for different trades: electrical, plumbing, HVAC, roofing, painting, etc. Track certifications, insurance, past performance ratings, and availability. Manage subcontractor agreements, scope of work, payment schedules, and performance bonds. Monitor work quality and schedule adherence. Handle work orders and change requests. Process progress payments and retain retention amounts. Maintain safety compliance records for all subcontractors on site.",
        category: "subcontractor"
    },
    {
        id: "construction_equipment_management",
        content: "Equipment Management in Construction CRM: Track owned and rented equipment: excavators, cranes, mixers, scaffolding, tools. Maintain equipment maintenance schedules and service history. Track equipment utilization across projects. Monitor equipment rental costs vs. purchase decisions. Schedule preventive maintenance. Track equipment location and allocation. Maintain operator certification records. Monitor fuel consumption and operating costs. Plan equipment needs for upcoming projects.",
        category: "equipment"
    },
    {
        id: "construction_quality_control",
        content: "Quality Control Processes: Implement quality checkpoints at each construction phase: foundation inspection, structural check, MEP (Mechanical, Electrical, Plumbing) verification, finishing quality, and final punch list. Document all inspections with photos and reports. Track defects and corrective actions. Maintain quality test reports for materials (concrete strength, steel grade, etc.). Conduct third-party audits for critical work. Use quality checklists for each trade. Store quality documentation for warranty reference.",
        category: "quality"
    },
    {
        id: "construction_document_management",
        content: "Construction Document Management: Organize documents by project: drawings and blueprints, specifications, contracts, permits, shop drawings, as-built drawings, RFIs (Request for Information), submittals, daily reports, meeting minutes, photos and videos, invoices, and warranties. Use version control for drawings. Implement document approval workflows. Provide secure client access to relevant documents. Maintain document retention policies. Use cloud storage for accessibility from site.",
        category: "documentation"
    },
    {
        id: "construction_payment_management",
        content: "Payment and Invoicing: Construction payment structures include: advance payment (10-20% on mobilization), progress payments (monthly based on work completion), retention (typically 5-10% held until completion), and final payment (after defect liability period). Generate progress bills with percentage completion certificates. Track payment collection against invoices. Manage payment to subcontractors and suppliers. Handle variation order billing. Maintain accounts receivable aging reports. Send payment reminders and follow-ups.",
        category: "payment"
    },
    {
        id: "construction_warranty_management",
        content: "Warranty and After-Sales Service: Track warranty periods for different components: structural warranty (typically 10 years), waterproofing (5-7 years), fixtures (1-2 years), equipment (manufacturer warranties). Maintain warranty documentation and service manuals. Schedule periodic maintenance visits. Track customer complaints and service requests. Maintain warranty claim history. Send warranty expiry reminders to clients. Build long-term relationships through excellent after-sales support.",
        category: "warranty"
    },
    {
        id: "construction_reporting_analytics",
        content: "Reporting and Analytics for Construction: Key reports include: Project profitability analysis, resource utilization reports, project timeline vs. actual, budget vs. actual costs, material consumption analysis, supplier performance metrics, equipment utilization, safety incident reports, quality defect trends, and cash flow projections. Use dashboards for real-time project status. Track KPIs: gross margin, project completion rate, customer satisfaction score, safety record, and on-time delivery percentage.",
        category: "analytics"
    },
    {
        id: "construction_crm_features",
        content: "Essential CRM Features for Construction: A construction-focused CRM should include: Contact management for clients, architects, engineers, suppliers, and subcontractors. Project tracking with Ganban boards and timelines. Quote and estimate generation with BOQ templates. Document management with version control. Inventory and material tracking. Timesheet and attendance management. Mobile access for site teams. Photo and progress documentation. Integration with accounting software. Automated follow-up reminders. Customizable workflows. Role-based access control.",
        category: "crm_features"
    },
    {
        id: "construction_risk_management",
        content: "Risk Management in Construction Projects: Identify and track risks: design changes, weather delays, material price escalation, labor shortages, equipment breakdown, permit delays, and scope creep. Create risk register with probability and impact assessment. Develop mitigation strategies for high-priority risks. Monitor risk triggers throughout project lifecycle. Maintain contingency budgets and buffers. Regular risk review meetings. Document lessons learned for future projects.",
        category: "risk"
    },
    {
        id: "construction_stakeholder_management",
        content: "Stakeholder Management: Construction projects involve multiple stakeholders: clients/owners, architects, engineers, consultants, contractors, subcontractors, suppliers, regulatory authorities, and end users. Maintain stakeholder register with contact info and communication requirements. Define escalation paths. Schedule regular coordination meetings. Use collaboration platforms for multi-party communication. Track decisions and approvals. Manage expectations with clear communication. Document all stakeholder interactions in CRM.",
        category: "stakeholder"
    },
    {
        id: "construction_scheduling",
        content: "Project Scheduling and Planning: Use Critical Path Method (CPM) or Program Evaluation and Review Technique (PERT) for complex projects. Break projects into work packages and activities. Define dependencies and sequencing. Allocate resources (labor, materials, equipment). Set realistic milestones and deadlines. Build in float time for uncertainties. Update schedules weekly based on progress. Track schedule variance. Identify and resolve bottlenecks. Coordinate with subcontractors for scheduling. Use scheduling software integrated with CRM.",
        category: "scheduling"
    }
];

/**
 * Get all construction knowledge documents
 */
export function getConstructionKnowledge() {
    return constructionKnowledge;
}

/**
 * Get knowledge by category
 */
export function getKnowledgeByCategory(category: string) {
    return constructionKnowledge.filter(item => item.category === category);
}

/**
 * Get all available categories
 */
export function getKnowledgeCategories() {
    const categoriesSet = new Set(constructionKnowledge.map(item => item.category));
    return Array.from(categoriesSet);
}
