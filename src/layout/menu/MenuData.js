const menu = [
  {
    icon: "cart-fill",
    text: "Dashboard",
    link: "/",
  },

  {
    heading: "System Management",
    allowedRole: "",
  },
  {
    icon: "users-fill",
    text: "User Manage",
    active: false,
    allowedRole: ["IT Officer"],
    subMenu: [
      {
        text: "Users List",
        link: "/users-list",
      },
      {
        text: "User Roles",
        link: "/user-roles",
      },
      {
        text: "User Titles",
        link: "/user-titles",
      },
    ],
  },

  {
    icon: "tile-thumb-fill",
    text: "Customers",
    active: false,
    allowedRole: ["Relation Officer PI", "Relation Manager BI"],
    subMenu: [
      {
        text: "Customers List",
        link: "/customers-list",
      },
    ],
  },

  {
    icon: "file-docs",
    text: "Personal Investments",
    active: false,
    allowedRole: [
      "Relation Officer PI",
      "Relation Manager PI",
      "Sharia",
      "Credit Analyst",
      "Credit Administration",
      "Credit Committee",
      "Operation",
    ],
    subMenu: [
      {
        text: "Personal Investments",
        link: "/individual-investments",
      },
    ],
  },
  {
    icon: "file-docs",
    text: "Business Investments",
    active: false,
    allowedRole: [
      "Relation Manager BI",
      "Relation Officer  BI",
      "Sharia",
      "Credit Analyst",
      "Credit Administration",
      "Credit Committee",
      "Operation",
    ],
    subMenu: [
      {
        text: "Business Investments",
        link: "/business-investments",
      },
    ],
  },
];
export default menu;
