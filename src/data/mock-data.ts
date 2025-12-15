import type {
  Room,
  Guest,
  Reservation,
  BillingItem,
  HousekeepingTask,
  RoomRate,
  OccupancyData,
  RoomType,
  RoomStatus,
} from "@/lib/hotel-types";

// ============================================================================
// Helper Functions
// ============================================================================

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getDateOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function generateConfirmationNumber(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const nums = "0123456789";
  return (
    letters[Math.floor(Math.random() * 26)] +
    letters[Math.floor(Math.random() * 26)] +
    nums[Math.floor(Math.random() * 10)] +
    nums[Math.floor(Math.random() * 10)] +
    nums[Math.floor(Math.random() * 10)] +
    nums[Math.floor(Math.random() * 10)]
  );
}

// ============================================================================
// Rooms Data - 40 rooms (20 King, 15 Queen, 5 Suite)
// ============================================================================

const roomFeatures = [
  "city_view",
  "balcony",
  "corner",
  "high_floor",
  "connecting",
  "accessible",
];

function createRoom(
  number: number,
  type: RoomType,
  status: RoomStatus,
  features: string[],
  currentGuestId?: string,
): Room {
  const baseRates: Record<RoomType, number> = {
    King: 189,
    Queen: 159,
    Suite: 349,
  };
  return {
    id: `room-${number}`,
    number,
    type,
    features,
    status,
    floor: Math.floor(number / 100),
    currentGuestId,
    rate: baseRates[type],
  };
}

export const rooms: Room[] = [
  // Floor 2 - Queens (201-210)
  createRoom(201, "Queen", "occupied", [], "guest-1"),
  createRoom(202, "Queen", "clean", ["accessible"]),
  createRoom(203, "Queen", "occupied", [], "guest-2"),
  createRoom(204, "Queen", "dirty", []),
  createRoom(205, "Queen", "clean", ["connecting"]),
  createRoom(206, "Queen", "occupied", [], "guest-3"),
  createRoom(207, "Queen", "clean", []),
  createRoom(208, "Queen", "dirty", []),
  createRoom(209, "Queen", "available", []),
  createRoom(210, "Queen", "occupied", [], "guest-4"),

  // Floor 3 - Kings (301-315)
  createRoom(301, "King", "occupied", ["city_view"], "guest-5"),
  createRoom(302, "King", "clean", ["city_view"]),
  createRoom(303, "King", "occupied", [], "guest-6"),
  createRoom(304, "King", "available", ["city_view", "corner"]),
  createRoom(305, "King", "clean", ["balcony"]),
  createRoom(306, "King", "dirty", ["city_view"]),
  createRoom(307, "King", "occupied", [], "guest-7"),
  createRoom(308, "King", "available", ["connecting"]),
  createRoom(309, "King", "clean", ["city_view"]),
  createRoom(310, "King", "occupied", ["balcony"], "guest-8"),
  createRoom(311, "King", "dirty", []),
  createRoom(312, "King", "available", ["city_view"]),
  createRoom(313, "King", "clean", []),
  createRoom(314, "King", "occupied", ["corner"], "guest-9"),
  createRoom(315, "King", "available", ["city_view", "high_floor"]),

  // Floor 4 - Kings (401-410)
  createRoom(401, "King", "occupied", ["high_floor", "city_view"], "guest-10"),
  createRoom(402, "King", "clean", ["high_floor"]),
  createRoom(403, "King", "available", ["high_floor", "city_view"]),
  createRoom(404, "King", "occupied", ["high_floor"], "guest-11"),
  createRoom(405, "King", "dirty", ["high_floor", "city_view"]),

  // Floor 5 - Suites (501-505)
  createRoom(
    501,
    "Suite",
    "occupied",
    ["city_view", "balcony", "corner"],
    "guest-12",
  ),
  createRoom(502, "Suite", "clean", ["city_view", "balcony"]),
  createRoom(503, "Suite", "available", ["city_view", "corner"]),
  createRoom(504, "Suite", "occupied", ["city_view", "balcony"], "guest-13"),
  createRoom(505, "Suite", "clean", ["city_view", "balcony", "corner"]),

  // Additional Queens on Floor 2
  createRoom(211, "Queen", "available", []),
  createRoom(212, "Queen", "clean", ["connecting"]),
  createRoom(213, "Queen", "dirty", []),
  createRoom(214, "Queen", "available", []),
  createRoom(215, "Queen", "occupied", [], "guest-14"),
];

// ============================================================================
// Guests Data - 25 guest profiles
// ============================================================================

export const guests: Guest[] = [
  {
    id: "guest-1",
    firstName: "Sarah",
    lastName: "Chen",
    email: "sarah.chen@email.com",
    phone: "(555) 123-4567",
    loyaltyTier: "Platinum",
    loyaltyNumber: "PLT-889234",
    preferences: ["high_floor", "city_view", "extra_pillows"],
    stayHistory: [
      {
        id: "stay-1",
        checkInDate: "2024-06-15",
        checkOutDate: "2024-06-18",
        roomNumber: 401,
        totalSpent: 892,
      },
      {
        id: "stay-2",
        checkInDate: "2024-09-22",
        checkOutDate: "2024-09-25",
        roomNumber: 315,
        totalSpent: 756,
      },
    ],
  },
  {
    id: "guest-2",
    firstName: "Michael",
    lastName: "Johnson",
    email: "mjohnson@corporate.com",
    phone: "(555) 234-5678",
    loyaltyTier: "Gold",
    loyaltyNumber: "GLD-556781",
    preferences: ["quiet_room", "late_checkout"],
    stayHistory: [
      {
        id: "stay-3",
        checkInDate: "2024-08-10",
        checkOutDate: "2024-08-12",
        roomNumber: 302,
        totalSpent: 412,
      },
    ],
  },
  {
    id: "guest-3",
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.w@gmail.com",
    phone: "(555) 345-6789",
    loyaltyTier: "Member",
    loyaltyNumber: "MEM-112233",
    preferences: [],
    stayHistory: [],
  },
  {
    id: "guest-4",
    firstName: "David",
    lastName: "Martinez",
    email: "dmartinez@business.com",
    phone: "(555) 456-7890",
    loyaltyTier: "Silver",
    loyaltyNumber: "SLV-445566",
    preferences: ["accessible", "ground_floor"],
    stayHistory: [
      {
        id: "stay-4",
        checkInDate: "2024-11-01",
        checkOutDate: "2024-11-03",
        roomNumber: 202,
        totalSpent: 356,
      },
    ],
  },
  {
    id: "guest-5",
    firstName: "Jennifer",
    lastName: "Brown",
    email: "jbrown@email.com",
    phone: "(555) 567-8901",
    loyaltyTier: "Platinum",
    loyaltyNumber: "PLT-778899",
    preferences: ["city_view", "balcony", "champagne"],
    stayHistory: [
      {
        id: "stay-5",
        checkInDate: "2024-03-20",
        checkOutDate: "2024-03-25",
        roomNumber: 501,
        totalSpent: 2145,
      },
      {
        id: "stay-6",
        checkInDate: "2024-07-14",
        checkOutDate: "2024-07-17",
        roomNumber: 504,
        totalSpent: 1456,
      },
      {
        id: "stay-7",
        checkInDate: "2024-10-05",
        checkOutDate: "2024-10-08",
        roomNumber: 501,
        totalSpent: 1678,
      },
    ],
  },
  {
    id: "guest-6",
    firstName: "Robert",
    lastName: "Taylor",
    email: "rtaylor@company.org",
    phone: "(555) 678-9012",
    loyaltyTier: "Gold",
    loyaltyNumber: "GLD-223344",
    preferences: ["early_checkin"],
    stayHistory: [],
  },
  {
    id: "guest-7",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@email.com",
    phone: "(555) 789-0123",
    loyaltyTier: "Member",
    loyaltyNumber: "MEM-334455",
    preferences: ["extra_towels"],
    stayHistory: [],
  },
  {
    id: "guest-8",
    firstName: "James",
    lastName: "Thomas",
    email: "jthomas@work.com",
    phone: "(555) 890-1234",
    loyaltyTier: "Silver",
    loyaltyNumber: "SLV-556677",
    preferences: ["quiet_room"],
    stayHistory: [
      {
        id: "stay-8",
        checkInDate: "2024-09-01",
        checkOutDate: "2024-09-04",
        roomNumber: 307,
        totalSpent: 623,
      },
    ],
  },
  {
    id: "guest-9",
    firstName: "Patricia",
    lastName: "Jackson",
    email: "pjackson@email.com",
    phone: "(555) 901-2345",
    loyaltyTier: "Gold",
    loyaltyNumber: "GLD-667788",
    preferences: ["corner", "high_floor"],
    stayHistory: [
      {
        id: "stay-9",
        checkInDate: "2024-05-10",
        checkOutDate: "2024-05-12",
        roomNumber: 314,
        totalSpent: 445,
      },
    ],
  },
  {
    id: "guest-10",
    firstName: "Christopher",
    lastName: "White",
    email: "cwhite@corp.com",
    phone: "(555) 012-3456",
    loyaltyTier: "Platinum",
    loyaltyNumber: "PLT-889900",
    preferences: ["city_view", "newspaper", "gym_access"],
    stayHistory: [
      {
        id: "stay-10",
        checkInDate: "2024-04-15",
        checkOutDate: "2024-04-20",
        roomNumber: 401,
        totalSpent: 1234,
      },
      {
        id: "stay-11",
        checkInDate: "2024-08-22",
        checkOutDate: "2024-08-26",
        roomNumber: 403,
        totalSpent: 978,
      },
    ],
  },
  {
    id: "guest-11",
    firstName: "Nancy",
    lastName: "Harris",
    email: "nharris@email.com",
    phone: "(555) 111-2222",
    loyaltyTier: "Member",
    loyaltyNumber: "MEM-990011",
    preferences: [],
    stayHistory: [],
  },
  {
    id: "guest-12",
    firstName: "Daniel",
    lastName: "Clark",
    email: "dclark@vip.com",
    phone: "(555) 222-3333",
    loyaltyTier: "Platinum",
    loyaltyNumber: "PLT-112244",
    preferences: ["suite", "balcony", "champagne", "spa_access"],
    stayHistory: [
      {
        id: "stay-12",
        checkInDate: "2024-02-14",
        checkOutDate: "2024-02-18",
        roomNumber: 501,
        totalSpent: 2567,
      },
      {
        id: "stay-13",
        checkInDate: "2024-06-01",
        checkOutDate: "2024-06-05",
        roomNumber: 504,
        totalSpent: 2890,
      },
    ],
  },
  {
    id: "guest-13",
    firstName: "Karen",
    lastName: "Lewis",
    email: "klewis@business.com",
    phone: "(555) 333-4444",
    loyaltyTier: "Gold",
    loyaltyNumber: "GLD-334466",
    preferences: ["city_view"],
    stayHistory: [],
  },
  {
    id: "guest-14",
    firstName: "Mark",
    lastName: "Peterson",
    email: "mpeterson@email.com",
    phone: "(555) 444-5555",
    loyaltyTier: "Member",
    loyaltyNumber: "MEM-556688",
    preferences: [],
    stayHistory: [],
  },
  // Additional guests for arrivals
  {
    id: "guest-15",
    firstName: "Amanda",
    lastName: "Robinson",
    email: "arobinson@email.com",
    phone: "(555) 555-6666",
    loyaltyTier: "Silver",
    loyaltyNumber: "SLV-778800",
    preferences: ["connecting"],
    stayHistory: [],
  },
  {
    id: "guest-16",
    firstName: "Steven",
    lastName: "Walker",
    email: "swalker@corp.com",
    phone: "(555) 666-7777",
    loyaltyTier: "Gold",
    loyaltyNumber: "GLD-889911",
    preferences: ["high_floor", "city_view"],
    stayHistory: [
      {
        id: "stay-14",
        checkInDate: "2024-10-20",
        checkOutDate: "2024-10-23",
        roomNumber: 315,
        totalSpent: 678,
      },
    ],
  },
  {
    id: "guest-17",
    firstName: "Michelle",
    lastName: "Hall",
    email: "mhall@email.com",
    phone: "(555) 777-8888",
    loyaltyTier: "Platinum",
    loyaltyNumber: "PLT-990022",
    preferences: ["suite", "spa_access", "late_checkout"],
    stayHistory: [
      {
        id: "stay-15",
        checkInDate: "2024-07-04",
        checkOutDate: "2024-07-08",
        roomNumber: 502,
        totalSpent: 1890,
      },
    ],
  },
  {
    id: "guest-18",
    firstName: "Kevin",
    lastName: "Young",
    email: "kyoung@work.com",
    phone: "(555) 888-9999",
    loyaltyTier: "Member",
    loyaltyNumber: "MEM-001122",
    preferences: [],
    stayHistory: [],
  },
  {
    id: "guest-19",
    firstName: "Stephanie",
    lastName: "King",
    email: "sking@email.com",
    phone: "(555) 999-0000",
    loyaltyTier: "Silver",
    loyaltyNumber: "SLV-223355",
    preferences: ["quiet_room"],
    stayHistory: [],
  },
  {
    id: "guest-20",
    firstName: "Brian",
    lastName: "Wright",
    email: "bwright@business.com",
    phone: "(555) 000-1111",
    loyaltyTier: "Gold",
    loyaltyNumber: "GLD-445577",
    preferences: ["corner"],
    stayHistory: [
      {
        id: "stay-16",
        checkInDate: "2024-11-10",
        checkOutDate: "2024-11-13",
        roomNumber: 304,
        totalSpent: 589,
      },
    ],
  },
  {
    id: "guest-21",
    firstName: "Rachel",
    lastName: "Lopez",
    email: "rlopez@email.com",
    phone: "(555) 101-2020",
    loyaltyTier: "Member",
    loyaltyNumber: "MEM-667799",
    preferences: [],
    stayHistory: [],
  },
  {
    id: "guest-22",
    firstName: "Andrew",
    lastName: "Hill",
    email: "ahill@corp.com",
    phone: "(555) 202-3030",
    loyaltyTier: "Platinum",
    loyaltyNumber: "PLT-889933",
    preferences: ["city_view", "balcony", "newspaper"],
    stayHistory: [
      {
        id: "stay-17",
        checkInDate: "2024-01-15",
        checkOutDate: "2024-01-20",
        roomNumber: 501,
        totalSpent: 2345,
      },
      {
        id: "stay-18",
        checkInDate: "2024-05-25",
        checkOutDate: "2024-05-29",
        roomNumber: 505,
        totalSpent: 1987,
      },
    ],
  },
  {
    id: "guest-23",
    firstName: "Laura",
    lastName: "Scott",
    email: "lscott@email.com",
    phone: "(555) 303-4040",
    loyaltyTier: "Silver",
    loyaltyNumber: "SLV-990044",
    preferences: ["accessible"],
    stayHistory: [],
  },
  {
    id: "guest-24",
    firstName: "Gregory",
    lastName: "Green",
    email: "ggreen@work.com",
    phone: "(555) 404-5050",
    loyaltyTier: "Gold",
    loyaltyNumber: "GLD-112266",
    preferences: ["early_checkin", "high_floor"],
    stayHistory: [],
  },
  {
    id: "guest-25",
    firstName: "Maria",
    lastName: "Adams",
    email: "madams@email.com",
    phone: "(555) 505-6060",
    loyaltyTier: "Member",
    loyaltyNumber: "MEM-334477",
    preferences: [],
    stayHistory: [],
  },
];

// ============================================================================
// Reservations Data - 20 reservations
// ============================================================================

const today = getToday();

export const reservations: Reservation[] = [
  // Currently checked in (matching occupied rooms)
  {
    id: "res-1",
    confirmationNumber: "SC4521",
    guestId: "guest-1",
    roomNumber: 201,
    roomType: "Queen",
    checkInDate: getDateOffset(-2),
    checkOutDate: getDateOffset(1),
    status: "checked_in",
    specialRequests: ["Extra pillows", "Late checkout requested"],
    estimatedArrivalTime: "14:00",
    createdAt: getDateOffset(-10),
  },
  {
    id: "res-2",
    confirmationNumber: "MJ7834",
    guestId: "guest-2",
    roomNumber: 203,
    roomType: "Queen",
    checkInDate: getDateOffset(-1),
    checkOutDate: getDateOffset(2),
    status: "checked_in",
    specialRequests: [],
    createdAt: getDateOffset(-14),
  },
  {
    id: "res-3",
    confirmationNumber: "EW2198",
    guestId: "guest-3",
    roomNumber: 206,
    roomType: "Queen",
    checkInDate: getDateOffset(-3),
    checkOutDate: today,
    status: "checked_in",
    specialRequests: [],
    createdAt: getDateOffset(-7),
  },
  {
    id: "res-4",
    confirmationNumber: "DM5567",
    guestId: "guest-4",
    roomNumber: 210,
    roomType: "Queen",
    checkInDate: getDateOffset(-1),
    checkOutDate: getDateOffset(3),
    status: "checked_in",
    specialRequests: ["Accessible room", "Ground floor"],
    createdAt: getDateOffset(-21),
  },
  {
    id: "res-5",
    confirmationNumber: "JB9012",
    guestId: "guest-5",
    roomNumber: 301,
    roomType: "King",
    checkInDate: getDateOffset(-2),
    checkOutDate: getDateOffset(1),
    status: "checked_in",
    specialRequests: ["City view", "Champagne on arrival"],
    createdAt: getDateOffset(-30),
  },
  {
    id: "res-6",
    confirmationNumber: "RT3456",
    guestId: "guest-6",
    roomNumber: 303,
    roomType: "King",
    checkInDate: today,
    checkOutDate: getDateOffset(2),
    status: "checked_in",
    specialRequests: ["Early check-in"],
    estimatedArrivalTime: "10:00",
    createdAt: getDateOffset(-5),
  },
  {
    id: "res-7",
    confirmationNumber: "LA7890",
    guestId: "guest-7",
    roomNumber: 307,
    roomType: "King",
    checkInDate: getDateOffset(-4),
    checkOutDate: today,
    status: "checked_in",
    specialRequests: ["Extra towels"],
    createdAt: getDateOffset(-14),
  },
  {
    id: "res-8",
    confirmationNumber: "JT1234",
    guestId: "guest-8",
    roomNumber: 310,
    roomType: "King",
    checkInDate: getDateOffset(-1),
    checkOutDate: getDateOffset(4),
    status: "checked_in",
    specialRequests: ["Quiet room"],
    createdAt: getDateOffset(-7),
  },
  {
    id: "res-9",
    confirmationNumber: "DC5678",
    guestId: "guest-12",
    roomNumber: 501,
    roomType: "Suite",
    checkInDate: getDateOffset(-3),
    checkOutDate: getDateOffset(2),
    status: "checked_in",
    specialRequests: ["Champagne", "Spa reservation", "Late checkout"],
    createdAt: getDateOffset(-45),
  },
  {
    id: "res-10",
    confirmationNumber: "KL9012",
    guestId: "guest-13",
    roomNumber: 504,
    roomType: "Suite",
    checkInDate: getDateOffset(-1),
    checkOutDate: getDateOffset(3),
    status: "checked_in",
    specialRequests: ["City view", "Fruit basket"],
    createdAt: getDateOffset(-20),
  },

  // Today's arrivals (confirmed, not yet checked in)
  {
    id: "res-11",
    confirmationNumber: "AR3344",
    guestId: "guest-15",
    roomNumber: undefined,
    roomType: "Queen",
    checkInDate: today,
    checkOutDate: getDateOffset(2),
    status: "confirmed",
    specialRequests: ["Connecting room if available"],
    estimatedArrivalTime: "15:00",
    createdAt: getDateOffset(-3),
  },
  {
    id: "res-12",
    confirmationNumber: "SW5566",
    guestId: "guest-16",
    roomNumber: 315,
    roomType: "King",
    checkInDate: today,
    checkOutDate: getDateOffset(3),
    status: "confirmed",
    specialRequests: ["High floor", "City view"],
    estimatedArrivalTime: "16:00",
    createdAt: getDateOffset(-7),
  },
  {
    id: "res-13",
    confirmationNumber: "MH7788",
    guestId: "guest-17",
    roomNumber: undefined,
    roomType: "Suite",
    checkInDate: today,
    checkOutDate: getDateOffset(4),
    status: "confirmed",
    specialRequests: ["Spa package", "Late checkout"],
    estimatedArrivalTime: "18:00",
    createdAt: getDateOffset(-14),
  },
  {
    id: "res-14",
    confirmationNumber: "MP2233", // Mark Peterson - for Problem Solving workflow
    guestId: "guest-14",
    roomNumber: 215,
    roomType: "Queen",
    checkInDate: today,
    checkOutDate: getDateOffset(2),
    status: "confirmed",
    specialRequests: [],
    estimatedArrivalTime: "14:00",
    createdAt: getDateOffset(-5),
  },

  // Tomorrow's arrivals
  {
    id: "res-15",
    confirmationNumber: "KY9900",
    guestId: "guest-18",
    roomNumber: undefined,
    roomType: "Queen",
    checkInDate: getDateOffset(1),
    checkOutDate: getDateOffset(3),
    status: "confirmed",
    specialRequests: [],
    estimatedArrivalTime: "14:00",
    createdAt: getDateOffset(-2),
  },
  {
    id: "res-16",
    confirmationNumber: "SK1122",
    guestId: "guest-19",
    roomNumber: undefined,
    roomType: "King",
    checkInDate: getDateOffset(1),
    checkOutDate: getDateOffset(4),
    status: "confirmed",
    specialRequests: ["Quiet room away from elevator"],
    estimatedArrivalTime: "15:00",
    createdAt: getDateOffset(-10),
  },

  // Future reservations
  {
    id: "res-17",
    confirmationNumber: "BW3344",
    guestId: "guest-20",
    roomNumber: undefined,
    roomType: "King",
    checkInDate: getDateOffset(3),
    checkOutDate: getDateOffset(6),
    status: "confirmed",
    specialRequests: ["Corner room"],
    createdAt: getDateOffset(-15),
  },
  {
    id: "res-18",
    confirmationNumber: "RL5566",
    guestId: "guest-21",
    roomNumber: undefined,
    roomType: "Queen",
    checkInDate: getDateOffset(4),
    checkOutDate: getDateOffset(6),
    status: "confirmed",
    specialRequests: [],
    createdAt: getDateOffset(-8),
  },
  {
    id: "res-19",
    confirmationNumber: "AH7788",
    guestId: "guest-22",
    roomNumber: undefined,
    roomType: "Suite",
    checkInDate: getDateOffset(5),
    checkOutDate: getDateOffset(9),
    status: "confirmed",
    specialRequests: ["Anniversary celebration", "Champagne", "Rose petals"],
    createdAt: getDateOffset(-30),
  },

  // Cancelled reservation
  {
    id: "res-20",
    confirmationNumber: "LS9900",
    guestId: "guest-23",
    roomNumber: undefined,
    roomType: "Queen",
    checkInDate: today,
    checkOutDate: getDateOffset(2),
    status: "cancelled",
    specialRequests: [],
    createdAt: getDateOffset(-12),
  },
];

// ============================================================================
// Billing Items Data
// ============================================================================

export const billingItems: BillingItem[] = [
  // Res-1 (Sarah Chen - Platinum)
  {
    id: "bill-1",
    reservationId: "res-1",
    description: "Room Charge - Queen",
    category: "room",
    amount: 159,
    date: getDateOffset(-2),
    isComped: false,
  },
  {
    id: "bill-2",
    reservationId: "res-1",
    description: "Room Charge - Queen",
    category: "room",
    amount: 159,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-3",
    reservationId: "res-1",
    description: "Room Service - Breakfast",
    category: "food",
    amount: 32,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-4",
    reservationId: "res-1",
    description: "Minibar",
    category: "amenity",
    amount: 24,
    date: getDateOffset(-1),
    isComped: false,
  },

  // Res-5 (Jennifer Brown - Platinum)
  {
    id: "bill-5",
    reservationId: "res-5",
    description: "Room Charge - King",
    category: "room",
    amount: 189,
    date: getDateOffset(-2),
    isComped: false,
  },
  {
    id: "bill-6",
    reservationId: "res-5",
    description: "Room Charge - King",
    category: "room",
    amount: 189,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-7",
    reservationId: "res-5",
    description: "Spa Treatment",
    category: "service",
    amount: 150,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-8",
    reservationId: "res-5",
    description: "Room Service - Dinner",
    category: "food",
    amount: 87,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-9",
    reservationId: "res-5",
    description: "Champagne (Welcome)",
    category: "amenity",
    amount: 0,
    date: getDateOffset(-2),
    isComped: true,
  },

  // Res-9 (Daniel Clark - Suite - Platinum)
  {
    id: "bill-10",
    reservationId: "res-9",
    description: "Room Charge - Suite",
    category: "room",
    amount: 349,
    date: getDateOffset(-3),
    isComped: false,
  },
  {
    id: "bill-11",
    reservationId: "res-9",
    description: "Room Charge - Suite",
    category: "room",
    amount: 349,
    date: getDateOffset(-2),
    isComped: false,
  },
  {
    id: "bill-12",
    reservationId: "res-9",
    description: "Room Charge - Suite",
    category: "room",
    amount: 349,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-13",
    reservationId: "res-9",
    description: "Spa Package - Deluxe",
    category: "service",
    amount: 275,
    date: getDateOffset(-2),
    isComped: false,
  },
  {
    id: "bill-14",
    reservationId: "res-9",
    description: "Restaurant - Fine Dining",
    category: "food",
    amount: 245,
    date: getDateOffset(-2),
    isComped: false,
  },
  {
    id: "bill-15",
    reservationId: "res-9",
    description: "Minibar",
    category: "amenity",
    amount: 56,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-16",
    reservationId: "res-9",
    description: "Champagne (VIP)",
    category: "amenity",
    amount: 0,
    date: getDateOffset(-3),
    isComped: true,
  },

  // Res-2 (Michael Johnson - Gold)
  {
    id: "bill-17",
    reservationId: "res-2",
    description: "Room Charge - Queen",
    category: "room",
    amount: 159,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-18",
    reservationId: "res-2",
    description: "Breakfast Buffet",
    category: "food",
    amount: 28,
    date: today,
    isComped: false,
  },

  // Res-8 (James Thomas - Silver)
  {
    id: "bill-19",
    reservationId: "res-8",
    description: "Room Charge - King",
    category: "room",
    amount: 189,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-20",
    reservationId: "res-8",
    description: "Parking - Daily",
    category: "service",
    amount: 35,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-21",
    reservationId: "res-8",
    description: "Laundry Service",
    category: "service",
    amount: 45,
    date: today,
    isComped: false,
  },

  // Res-10 (Karen Lewis - Suite - Gold)
  {
    id: "bill-22",
    reservationId: "res-10",
    description: "Room Charge - Suite",
    category: "room",
    amount: 349,
    date: getDateOffset(-1),
    isComped: false,
  },
  {
    id: "bill-23",
    reservationId: "res-10",
    description: "Room Service - Lunch",
    category: "food",
    amount: 56,
    date: today,
    isComped: false,
  },
  {
    id: "bill-24",
    reservationId: "res-10",
    description: "Spa - Massage",
    category: "service",
    amount: 120,
    date: today,
    isComped: false,
  },

  // Other active reservations
  {
    id: "bill-25",
    reservationId: "res-3",
    description: "Room Charge - Queen",
    category: "room",
    amount: 159,
    date: getDateOffset(-3),
    isComped: false,
  },
  {
    id: "bill-26",
    reservationId: "res-3",
    description: "Room Charge - Queen",
    category: "room",
    amount: 159,
    date: getDateOffset(-2),
    isComped: false,
  },
  {
    id: "bill-27",
    reservationId: "res-3",
    description: "Room Charge - Queen",
    category: "room",
    amount: 159,
    date: getDateOffset(-1),
    isComped: false,
  },

  {
    id: "bill-28",
    reservationId: "res-4",
    description: "Room Charge - Queen",
    category: "room",
    amount: 159,
    date: getDateOffset(-1),
    isComped: false,
  },

  {
    id: "bill-29",
    reservationId: "res-6",
    description: "Room Charge - King",
    category: "room",
    amount: 189,
    date: today,
    isComped: false,
  },

  {
    id: "bill-30",
    reservationId: "res-7",
    description: "Room Charge - King",
    category: "room",
    amount: 189,
    date: getDateOffset(-4),
    isComped: false,
  },
  {
    id: "bill-31",
    reservationId: "res-7",
    description: "Room Charge - King",
    category: "room",
    amount: 189,
    date: getDateOffset(-3),
    isComped: false,
  },
  {
    id: "bill-32",
    reservationId: "res-7",
    description: "Room Charge - King",
    category: "room",
    amount: 189,
    date: getDateOffset(-2),
    isComped: false,
  },
  {
    id: "bill-33",
    reservationId: "res-7",
    description: "Room Charge - King",
    category: "room",
    amount: 189,
    date: getDateOffset(-1),
    isComped: false,
  },
];

// ============================================================================
// Housekeeping Tasks Data
// ============================================================================

export const housekeepingTasks: HousekeepingTask[] = [
  // Dirty rooms needing cleaning
  {
    id: "hk-1",
    roomNumber: 204,
    status: "dirty",
    priority: "normal",
    assignedTo: "Maria",
    notes: "Guest checked out at 10am",
    lastUpdated: today,
  },
  {
    id: "hk-2",
    roomNumber: 208,
    status: "dirty",
    priority: "normal",
    assignedTo: "Carlos",
    lastUpdated: today,
  },
  {
    id: "hk-3",
    roomNumber: 306,
    status: "dirty",
    priority: "rush",
    assignedTo: "Maria",
    notes: "VIP arrival at 2pm",
    lastUpdated: today,
  },
  {
    id: "hk-4",
    roomNumber: 311,
    status: "dirty",
    priority: "normal",
    lastUpdated: today,
  },
  {
    id: "hk-5",
    roomNumber: 405,
    status: "dirty",
    priority: "normal",
    assignedTo: "Ana",
    lastUpdated: today,
  },
  {
    id: "hk-6",
    roomNumber: 213,
    status: "dirty",
    priority: "rush",
    notes: "Early arrival confirmed",
    lastUpdated: today,
  },

  // In progress
  {
    id: "hk-7",
    roomNumber: 302,
    status: "in_progress",
    priority: "normal",
    assignedTo: "Carlos",
    lastUpdated: today,
  },
  {
    id: "hk-8",
    roomNumber: 309,
    status: "in_progress",
    priority: "rush",
    assignedTo: "Ana",
    notes: "Platinum member arriving",
    lastUpdated: today,
  },
  {
    id: "hk-9",
    roomNumber: 502,
    status: "in_progress",
    priority: "normal",
    assignedTo: "Maria",
    notes: "Deep clean scheduled",
    lastUpdated: today,
  },

  // Ready (recently cleaned)
  {
    id: "hk-10",
    roomNumber: 202,
    status: "ready",
    priority: "normal",
    assignedTo: "Carlos",
    lastUpdated: today,
  },
  {
    id: "hk-11",
    roomNumber: 205,
    status: "ready",
    priority: "normal",
    assignedTo: "Ana",
    lastUpdated: today,
  },
  {
    id: "hk-12",
    roomNumber: 207,
    status: "ready",
    priority: "normal",
    assignedTo: "Maria",
    lastUpdated: today,
  },
  {
    id: "hk-13",
    roomNumber: 305,
    status: "ready",
    priority: "normal",
    assignedTo: "Carlos",
    lastUpdated: today,
  },
  {
    id: "hk-14",
    roomNumber: 313,
    status: "ready",
    priority: "normal",
    assignedTo: "Ana",
    lastUpdated: today,
  },
  {
    id: "hk-15",
    roomNumber: 505,
    status: "ready",
    priority: "normal",
    assignedTo: "Maria",
    notes: "Suite - extra attention",
    lastUpdated: today,
  },
];

// ============================================================================
// Room Rates Data - 14 days (7 past, 7 future)
// ============================================================================

function generateRoomRates(): RoomRate[] {
  const rates: RoomRate[] = [];
  const roomTypes: RoomType[] = ["King", "Queen", "Suite"];
  const baseRates: Record<RoomType, number> = {
    King: 189,
    Queen: 159,
    Suite: 349,
  };

  const competitors = [
    { name: "Marriott Downtown", multiplier: 0.95 },
    { name: "Hilton City Center", multiplier: 1.05 },
    { name: "Hyatt Regency", multiplier: 0.98 },
  ];

  for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
    const date = getDateOffset(dayOffset);
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Weekend rates are lower (to show the problem in the demo)
    const weekendMultiplier = isWeekend ? 1.15 : 1.0;
    // Historical rates were lower
    const historicalMultiplier = dayOffset < 0 ? 0.95 : 1.0;

    for (const roomType of roomTypes) {
      const baseRate = baseRates[roomType];
      const rate = Math.round(
        baseRate * weekendMultiplier * historicalMultiplier,
      );

      rates.push({
        id: `rate-${roomType}-${date}`,
        roomType,
        date,
        rate,
        competitorRates: competitors.map((c) => ({
          name: c.name,
          rate: Math.round(rate * c.multiplier),
        })),
      });
    }
  }

  return rates;
}

export const roomRates: RoomRate[] = generateRoomRates();

// ============================================================================
// Occupancy Data - 30 days historical + 7 days projected
// ============================================================================

function generateOccupancyData(): OccupancyData[] {
  const data: OccupancyData[] = [];
  const totalRooms = 40;

  for (let dayOffset = -30; dayOffset <= 7; dayOffset++) {
    const date = getDateOffset(dayOffset);
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isFriday = dayOfWeek === 5;

    // Base occupancy varies by day
    let baseOccupancy: number;
    if (isWeekend) {
      baseOccupancy = 60 + Math.random() * 15; // 60-75% weekends (lower)
    } else if (isFriday) {
      baseOccupancy = 75 + Math.random() * 15; // 75-90% Fridays
    } else {
      baseOccupancy = 80 + Math.random() * 15; // 80-95% weekdays
    }

    // Future dates have slightly lower projected occupancy
    if (dayOffset > 0) {
      baseOccupancy *= 0.9;
    }

    const occupancyRate = Math.round(baseOccupancy);
    const occupiedRooms = Math.round((occupancyRate / 100) * totalRooms);

    // Calculate revenue (mix of room types)
    const avgRate = 185; // Weighted average
    const revenue = occupiedRooms * avgRate;

    data.push({
      date,
      occupancyRate,
      totalRooms,
      occupiedRooms,
      revenue,
    });
  }

  return data;
}

export const occupancyData: OccupancyData[] = generateOccupancyData();

// ============================================================================
// Historical Occupancy (Last Year Same Period)
// ============================================================================

function generateHistoricalOccupancy(): OccupancyData[] {
  const data: OccupancyData[] = [];
  const totalRooms = 40;

  for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + dayOffset);
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    const date = currentDate.toISOString().split("T")[0];

    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Last year had better weekend occupancy
    let baseOccupancy: number;
    if (isWeekend) {
      baseOccupancy = 82 + Math.random() * 10; // 82-92% (better than current)
    } else {
      baseOccupancy = 85 + Math.random() * 10; // 85-95%
    }

    const occupancyRate = Math.round(baseOccupancy);
    const occupiedRooms = Math.round((occupancyRate / 100) * totalRooms);
    const avgRate = 165; // Last year's rates were lower
    const revenue = occupiedRooms * avgRate;

    data.push({
      date,
      occupancyRate,
      totalRooms,
      occupiedRooms,
      revenue,
    });
  }

  return data;
}

export const historicalOccupancy: OccupancyData[] =
  generateHistoricalOccupancy();

// ============================================================================
// Helper function to get guest by ID
// ============================================================================

export function getGuestById(guestId: string): Guest | undefined {
  return guests.find((g) => g.id === guestId);
}

export function getReservationWithGuest(
  reservation: Reservation,
): Reservation & { guest: Guest } {
  const guest = getGuestById(reservation.guestId);
  if (!guest) {
    throw new Error(`Guest not found for reservation ${reservation.id}`);
  }
  return { ...reservation, guest };
}

export function getRoomByNumber(roomNumber: number): Room | undefined {
  return rooms.find((r) => r.number === roomNumber);
}

export function getBillingForReservation(reservationId: string): BillingItem[] {
  return billingItems.filter((b) => b.reservationId === reservationId);
}

export function getHousekeepingForRoom(
  roomNumber: number,
): HousekeepingTask | undefined {
  return housekeepingTasks.find((t) => t.roomNumber === roomNumber);
}

export function getRateForRoomType(
  roomType: RoomType,
  date: string,
): RoomRate | undefined {
  return roomRates.find((r) => r.roomType === roomType && r.date === date);
}
