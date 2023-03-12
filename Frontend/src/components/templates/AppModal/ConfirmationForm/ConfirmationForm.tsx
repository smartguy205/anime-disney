import { useEffect } from "react";
import Button from "components/atoms/Button";
import { modalActions } from "redux/slices/modal";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import SubscriptionService from "services/subscription.service";

export default function ConfirmationForm() {
	const dispatch = useAppDispatch();
	const data = useAppSelector((state) => state.modal.data);

	useEffect(() => {
		return () => {
			SubscriptionService.unsubscribe();
		};
	}, []);

	const onClickYes = () => SubscriptionService.call();

	return (
		<div>
			<h3>{data.heading}</h3>
			<p>{data.message}</p>
			<Button
				variant="outlined"
				sx={{ marginRight: "10px" }}
				onClick={() => dispatch(modalActions.closeModal())}
			>
				No
			</Button>
			<Button variant="contained" onClick={onClickYes}>
				Yes
			</Button>
		</div>
	);
}
