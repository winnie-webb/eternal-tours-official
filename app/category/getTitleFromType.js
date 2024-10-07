export default function getTitleFromType(type) {
  let title;
  switch (type) {
    case "mpt":
      title = "Most Popular Tours";
      break;
    case "at":
      title = "Airport Transfers";
      break;
    case "cse":
      title = "Cruise Shore Excursions";
      break;
    case "ctp":
      title = "Combo Tour Packages";
      break;
    case "egt":
      title = "Exclusive Golf Tours";
      break;
    case "st":
      title = "Shopping Tours";
      break;
    case "abc":
      title = "Attractions / Beach / City Tours";
      break;
    case "edt":
      title = "Eating / Dining Tours";
      break;
    default:
      title = "Other Tours";
  }
  return title;
}
