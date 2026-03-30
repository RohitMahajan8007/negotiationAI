import { useSelector, useDispatch } from 'react-redux';
import { startMission, submitOffer, fetchLeaderboard, resetGame } from '../state/negotiationSlice';

const useNegotiation = () => {
    const dispatch = useDispatch();
    const { game, history, leaderboard, status, error } = useSelector((state) => state.negotiation);

    const start = (userId, productId) => dispatch(startMission({ userId, productId }));
    const offer = (payload) => dispatch(submitOffer(payload));
    const leaderboardFetch = () => dispatch(fetchLeaderboard());
    const reset = () => dispatch(resetGame());

    return { game, history, leaderboard, status, error, start, offer, leaderboardFetch, reset };
};

export default useNegotiation;
