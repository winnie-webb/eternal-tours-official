export default function getPickupTitle(pickup) {
  let pickupName = "";
  if (pickup.toLowerCase().includes("falmouth")) {
    pickupName = "Falmouth & Duncans (Trelawny)";
  } else if (pickup.toLowerCase().includes("lucea")) {
    pickupName = "Lucea (Grand Palladium, Hanover)";
  } else if (pickup.toLowerCase().includes("mobay")) {
    pickupName = "Montego Bay (St. James)";
  } else if (pickup.toLowerCase().includes("negril")) {
    pickupName = "Negril (Westmoreland)";
  } else if (pickup.toLowerCase().includes("ochi")) {
    pickupName = "Ocho Rios (St. Ann)";
  } else if (pickup.toLowerCase().includes("runaway")) {
    pickupName = "Runaway Bay (St. Ann)";
  } else if (pickup.toLowerCase().includes("ksp")) {
    pickupName = "Kingston, Spanish Town & Portmore";
  } else if (pickup.toLowerCase().includes("mandeville")) {
    pickupName = "Mandeville (Manchester)";
  } else if (pickup.toLowerCase().includes("portantonio")) {
    pickupName = "Port Antonio (Portland)";
  } else if (pickup.toLowerCase().includes("treasurebeach")) {
    pickupName = "Treasure Beach (St.Elizabeth)";
  } else if (pickup.toLowerCase().includes("breathless")) {
    pickupName = "Breathless, Montego Bay";
  } else if (pickup.toLowerCase().includes("sunset")) {
    pickupName = "Sunset Beach Resort";
  } else if (pickup.toLowerCase().includes("secrets")) {
    pickupName = "Secrets St.James & Wild Orchid, Montego Bay";
  } else {
    pickupName = "Dm us for more locations.";
  }
  return pickupName;
}
