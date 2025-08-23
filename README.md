# Market Muse Track - Portfolio Management Application

## Description

A comprehensive portfolio management application that allows users to track investments, analyze market trends, and manage their financial portfolios with real-time updates and intuitive UI.

## Features

- Real-time portfolio tracking with live price updates
- Add, edit, and delete transactions
- Portfolio performance charts and analytics
- Market news integration
- Responsive design with modern UI components
- Toast notifications for user feedback

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, MongoDB, Socket.IO
- **State Management**: React Query (TanStack Query)
- **Real-time Updates**: WebSocket connections
- **Styling**: Tailwind CSS with shadcn/ui components
- **Notifications**: Sonner toast notifications

## Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- API keys for:
  - Twelve Data (stocks)
  - CoinGecko (cryptocurrencies)
  - News API provider

### 1. Clone the Repository

```bash
git clone <repository-url>
cd market-muse-track-main
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/market-muse-track
TWELVEDATA_API_KEY=your_twelve_data_api_key
NEWS_PROVIDER=yahoo
BASE_CURRENCY=USD
PORT=4000
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the Frontend directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### 4. Database Setup

```bash
cd Backend
npm run seed
```

### 5. Start the Application

Start the backend server:

```bash
cd Backend
npm run seed:portfolios
npm run seed:transactions
npm run dev

```

Start the frontend application (in a new terminal):

```bash
cd Frontend
npm run dev
```

### 6. Access the Application

Open your browser and navigate to `http://localhost:8000`

## Usage

### Portfolio Management

- View portfolio summary with total value, daily changes, and gain/loss
- Add new transactions through the intuitive form
- Edit existing transactions using the modal interface
- Delete transactions with confirmation and feedback

### Real-time Features

- Live price updates for stocks and cryptocurrencies
- Automatic portfolio value recalculations
- Real-time market news integration

## API Endpoints

### Portfolio Endpoints

- `GET /api/portfolios` - List all portfolios
- `GET /api/portfolios/:id` - Get portfolio details
- `GET /api/portfolios/:id/summary` - Portfolio summary/KPIs
- `GET /api/portfolios/:id/holdings` - Portfolio holdings

### Transaction Endpoints

- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Market Data Endpoints

- `GET /api/quotes?symbols=AAPL,BTC` - Get price quotes
- `GET /api/news?symbol=AAPL` - Get market news

## Deployment

### Production Build

```bash
# Build frontend
cd Frontend
npm run build

# Start backend in production
cd Backend
npm start
```

### Environment Variables for Production

Update the `.env` files with production values:

- MongoDB connection string for production
- Production API keys
- Domain-specific URLs

### Deployment Options

- **Vercel**: Frontend deployment
- **Railway/Heroku**: Backend deployment
- **MongoDB Atlas**: Cloud database
- **Netlify**: Alternative frontend hosting

## Project Structure

```
market-muse-track-main/
├── Backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── jobs/            # Background jobs
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── data/            # Mock data and types
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Twelve Data for stock market data
- CoinGecko for cryptocurrency data
- shadcn/ui for the component library
- React Query for state management
