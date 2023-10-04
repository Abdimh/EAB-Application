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
    allowedRole: "IT Officer",
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
    allowedRole: ["Relation Officer Investments"],
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
    allowedRole: ["Relation Manager Investments", "Relation Officer Investments"],
    subMenu: [
      {
        text: "Personal Investments",
        link: "/individual-investments",
      },

      {
        text: "Form Wizard",
        link: "/form-wizard",
        allowedRole: "",
      },
    ],
  },
  {
    icon: "file-docs",
    text: "Business Investments",
    active: false,
    allowedRole: ["Relation Manager Business", "Relation Officer     Business"],
    subMenu: [
      {
        text: "Personal Investments",
        link: "/individual-investments",
      },

      {
        text: "Form Wizard",
        link: "/form-wizard",
        allowedRole: "",
      },
    ],
  },
];
export default menu;
