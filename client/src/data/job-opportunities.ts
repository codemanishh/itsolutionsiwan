export interface JobCategory {
  title: string;
  opportunities: string[];
}

const jobOpportunities: JobCategory[] = [
  {
    title: "ADCA करने से कौन सी नौकरी मिलती है?",
    opportunities: [
      "Computer Operator",
      "Data Entry Operator",
      "DTP Operator",
      "Office Executive",
      "Graphic Designer",
      "Customer Support",
      "Programmer",
      "Photo Editor",
      "Accountant",
      "Help Desk Operator"
    ]
  },
  {
    title: "सरकारी ऑफिस में नौकरी पाएँ",
    opportunities: [
      "क्लार्क में",
      "कंप्यूटर / कंप्यूटर ऑपरेटर में",
      "डेटा एंट्री ऑपरेटर में",
      "डेस्कटॉप पब्लिशिंग में",
      "L.I.C Office में",
      "कल्याण विभाग में",
      "कृषि विभाग में",
      "ग्रामीण विकास विभाग में"
    ]
  }
];

export default jobOpportunities;
