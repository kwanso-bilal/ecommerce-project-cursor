/**
 * Dashboard data from mock REST APIs.
 * Sidebar menu, KPIs, revenue chart, and recent invoices.
 */

const DUMMY_JSON_BASE = 'https://dummyjson.com';

export interface SidebarSection {
  title: string;
  items: { label: string; path: string; icon: string }[];
}

export interface DashboardStats {
  registeredOrganizations: number;
  totalRevenue: string;
  ordersProcessedToday: number;
}

export interface RevenuePoint {
  month: string;
  lastYear: number;
  thisYear: number;
}

export interface RecentInvoice {
  companyName: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
}

async function request<T>(url: string): Promise<{ data?: T; error?: string }> {
  try {
    const res = await fetch(url);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: (json.message ?? json.error ?? 'Request failed') as string };
    return { data: json as T };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Network error' };
  }
}

/** Sidebar menu structure – labels from mock API (DummyJSON users response shape used to drive menu) */
export async function getSidebarMenu(): Promise<{ data?: SidebarSection[]; error?: string }> {
  const { data } = await request<{ total?: number }>(`${DUMMY_JSON_BASE}/users?limit=1`);
  if (data === undefined) {
    return {
      data: [
        {
          title: 'GENERAL',
          items: [
            { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
            { label: 'Products', path: '/dashboard/products', icon: 'inventory' },
            { label: 'Organizations', path: '/dashboard/organizations', icon: 'business' },
            { label: 'Orders', path: '/dashboard/orders', icon: 'shopping_cart' },
            { label: 'Payments', path: '/dashboard/payments', icon: 'payment' },
            { label: 'Reviews', path: '/dashboard/reviews', icon: 'rate_review' },
          ],
        },
        {
          title: 'ACCOUNT',
          items: [{ label: 'Change Password', path: '/dashboard/change-password', icon: 'lock' }],
        },
      ],
    };
  }
  return {
    data: [
      {
        title: 'GENERAL',
        items: [
          { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
          { label: 'Products', path: '/dashboard/products', icon: 'inventory' },
          { label: 'Organizations', path: '/dashboard/organizations', icon: 'business' },
          { label: 'Orders', path: '/dashboard/orders', icon: 'shopping_cart' },
          { label: 'Payments', path: '/dashboard/payments', icon: 'payment' },
          { label: 'Reviews', path: '/dashboard/reviews', icon: 'rate_review' },
        ],
      },
      {
        title: 'ACCOUNT',
        items: [{ label: 'Change Password', path: '/dashboard/change-password', icon: 'lock' }],
      },
    ],
  };
}

/** KPI stats – registered orgs from DummyJSON users total, revenue/carts, orders from mock */
export async function getDashboardStats(): Promise<{ data?: DashboardStats; error?: string }> {
  const [usersRes, cartsRes] = await Promise.all([
    request<{ total?: number }>(`${DUMMY_JSON_BASE}/users?limit=0`),
    request<{ carts?: Array<{ total?: number }>; total?: number }>(`${DUMMY_JSON_BASE}/carts`),
  ]);
  const userTotal = usersRes.data?.total ?? 84;
  let totalRevenue = 136938;
  if (cartsRes.data?.carts?.length) {
    totalRevenue = cartsRes.data.carts.reduce((sum, c) => sum + (c.total ?? 0), 0);
    if (totalRevenue < 1000) totalRevenue = 136938;
  }
  const ordersToday = 165;
  return {
    data: {
      registeredOrganizations: userTotal,
      totalRevenue: `$${totalRevenue.toLocaleString()}`,
      ordersProcessedToday: ordersToday,
    },
  };
}

/** Revenue chart – last year vs this year by month (mock from DummyJSON products count as seed) */
export async function getRevenueChart(): Promise<{ data?: RevenuePoint[]; error?: string }> {
  const { data } = await request<{ total?: number }>(`${DUMMY_JSON_BASE}/products?limit=0`);
  const seed = data?.total ?? 100;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lastYear = months.map((_, i) => 50000 + (seed * (i + 1) * 3) % 80000);
  const thisYear = months.map((_, i) => 55000 + (seed * (i + 2) * 4) % 120000);
  return {
    data: months.map((month, i) => ({
      month,
      lastYear: lastYear[i],
      thisYear: thisYear[i],
    })),
  };
}

/** Organizations – from DummyJSON users with company data */
export interface Organization {
  id: string;
  name: string;
  email: string;
  department: string;
  employees?: number;
  city: string;
  country: string;
}

export async function getOrganizations(limit = 30, skip = 0): Promise<{ data?: { organizations: Organization[]; total: number }; error?: string }> {
  const { data } = await request<{
    users?: Array<{
      id: number;
      email: string;
      company?: { name?: string; department?: string };
      address?: { city?: string; country?: string };
    }>;
    total?: number;
  }>(`${DUMMY_JSON_BASE}/users?limit=${limit}&skip=${skip}&select=id,email,company,address`);
  if (!data?.users?.length) {
    return {
      data: {
        organizations: [],
        total: 0,
      },
    };
  }
  const orgs = data.users
    .filter((u) => u.company?.name)
    .map((u) => ({
      id: String(u.id),
      name: u.company?.name ?? 'Unknown',
      email: u.email ?? '',
      department: u.company?.department ?? 'N/A',
      employees: Math.floor(Math.random() * 500) + 10,
      city: u.address?.city ?? 'N/A',
      country: u.address?.country ?? 'N/A',
    }));
  return {
    data: {
      organizations: orgs,
      total: data.total ?? orgs.length,
    },
  };
}

/** Payments – from DummyJSON carts */
export interface Payment {
  id: string;
  transactionId: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  method: string;
  userId: number;
}

export async function getPayments(limit = 30, skip = 0): Promise<{ data?: { payments: Payment[]; total: number }; error?: string }> {
  const { data } = await request<{
    carts?: Array<{
      id: number;
      userId: number;
      total: number;
      discountedTotal: number;
    }>;
    total?: number;
  }>(`${DUMMY_JSON_BASE}/carts?limit=${limit}&skip=${skip}`);
  if (!data?.carts?.length) {
    return {
      data: {
        payments: [],
        total: 0,
      },
    };
  }
  const statuses: Array<'completed' | 'pending' | 'failed'> = ['completed', 'completed', 'completed', 'pending', 'failed'];
  const methods = ['Credit Card', 'Debit Card', 'PayPal', 'Bank Transfer', 'Stripe'];
  const now = new Date();
  const payments = data.carts.map((cart, i) => {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return {
      id: String(cart.id),
      transactionId: `TXN-${String(cart.id).padStart(6, '0')}`,
      amount: `$${cart.discountedTotal.toFixed(2)}`,
      status: statuses[i % statuses.length] as 'completed' | 'pending' | 'failed',
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      method: methods[i % methods.length],
      userId: cart.userId,
    };
  });
  return {
    data: {
      payments,
      total: data.total ?? payments.length,
    },
  };
}

/** Products – from DummyJSON products */
export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail?: string;
}

export async function getProducts(limit = 30, skip = 0): Promise<{ data?: { products: Product[]; total: number }; error?: string }> {
  const { data } = await request<{
    products?: Array<{
      id: number;
      title: string;
      category: string;
      price: number;
      discountPercentage: number;
      rating: number;
      stock: number;
      brand: string;
      thumbnail?: string;
    }>;
    total?: number;
  }>(`${DUMMY_JSON_BASE}/products?limit=${limit}&skip=${skip}&select=id,title,category,price,discountPercentage,rating,stock,brand,thumbnail`);
  if (!data?.products?.length) {
    return {
      data: {
        products: [],
        total: 0,
      },
    };
  }
  const products = data.products.map((p) => ({
    id: String(p.id),
    title: p.title,
    category: p.category,
    price: p.price,
    discountPercentage: p.discountPercentage,
    rating: p.rating,
    stock: p.stock,
    brand: p.brand,
    thumbnail: p.thumbnail,
  }));
  return {
    data: {
      products,
      total: data.total ?? products.length,
    },
  };
}

/** Orders – from DummyJSON todos (using as order tasks) */
export interface Order {
  id: string;
  orderNumber: string;
  description: string;
  status: 'completed' | 'pending';
  customerId: number;
  date: string;
}

export async function getOrders(limit = 30, skip = 0): Promise<{ data?: { orders: Order[]; total: number }; error?: string }> {
  const { data } = await request<{
    todos?: Array<{
      id: number;
      todo: string;
      completed: boolean;
      userId: number;
    }>;
    total?: number;
  }>(`${DUMMY_JSON_BASE}/todos?limit=${limit}&skip=${skip}`);
  if (!data?.todos?.length) {
    return {
      data: {
        orders: [],
        total: 0,
      },
    };
  }
  const now = new Date();
  const orders = data.todos.map((todo) => {
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return {
      id: String(todo.id),
      orderNumber: `ORD-${String(todo.id).padStart(6, '0')}`,
      description: todo.todo,
      status: (todo.completed ? 'completed' : 'pending') as 'completed' | 'pending',
      customerId: todo.userId,
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
  });
  return {
    data: {
      orders,
      total: data.total ?? orders.length,
    },
  };
}

/** Reviews – from DummyJSON comments */
export interface Review {
  id: string;
  body: string;
  productId: number;
  likes: number;
  userName: string;
  fullName: string;
}

export async function getReviews(limit = 30, skip = 0): Promise<{ data?: { reviews: Review[]; total: number }; error?: string }> {
  const { data } = await request<{
    comments?: Array<{
      id: number;
      body: string;
      postId: number;
      likes: number;
      user?: {
        username: string;
        fullName: string;
      };
    }>;
    total?: number;
  }>(`${DUMMY_JSON_BASE}/comments?limit=${limit}&skip=${skip}`);
  if (!data?.comments?.length) {
    return {
      data: {
        reviews: [],
        total: 0,
      },
    };
  }
  const reviews = data.comments.map((comment) => ({
    id: String(comment.id),
    body: comment.body,
    productId: comment.postId,
    likes: comment.likes,
    userName: comment.user?.username ?? 'anonymous',
    fullName: comment.user?.fullName ?? 'Anonymous User',
  }));
  return {
    data: {
      reviews,
      total: data.total ?? reviews.length,
    },
  };
}

/** Change password – mock API */
export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ data?: { success: boolean; message: string }; error?: string }> {
  await new Promise((r) => setTimeout(r, 800));
  if (input.currentPassword.length < 1) {
    return { error: 'Current password is required' };
  }
  if (input.newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters' };
  }
  return {
    data: {
      success: true,
      message: 'Password changed successfully.',
    },
  };
}

/** Recent invoices – company names from DummyJSON users or mock */
export async function getRecentInvoices(): Promise<{ data?: RecentInvoice[]; error?: string }> {
  const { data } = await request<{ users?: Array<{ company?: { name?: string }; firstName?: string }> }>(
    `${DUMMY_JSON_BASE}/users?limit=8`
  );
  const companies = [
    'Aprico',
    'Mermedia',
    'Sun show',
    'Tiger well',
    'Voyagetronics',
    'Sanitarium Servic...',
    'Granite Industries',
    'Imagine Solutions',
  ];
  const dates = ['11/7/16', '5/27/15', '8/12/16', '3/4/15', '9/22/16', '1/19/15', '7/8/16', '12/14/15'];
  const amounts: { amount: string; type: 'income' | 'expense' }[] = [
    { amount: '$100.00', type: 'income' },
    { amount: '$25.00', type: 'expense' },
    { amount: '$200.00', type: 'expense' },
    { amount: '$10.00', type: 'income' },
    { amount: '$150.00', type: 'income' },
    { amount: '$75.00', type: 'expense' },
    { amount: '$300.00', type: 'income' },
    { amount: '$50.00', type: 'expense' },
  ];
  if (data?.users?.length) {
    const names = data.users.map((u) => u.company?.name ?? (`${u.firstName ?? ''} Co.`.trim() || 'Company'));
    return {
      data: names.slice(0, 8).map((companyName, i) => ({
        companyName: companyName.length > 20 ? companyName.slice(0, 17) + '...' : companyName,
        date: dates[i],
        amount: amounts[i].amount,
        type: amounts[i].type,
      })),
    };
  }
  return {
    data: companies.map((companyName, i) => ({
      companyName,
      date: dates[i],
      amount: amounts[i].amount,
      type: amounts[i].type,
    })),
  };
}
