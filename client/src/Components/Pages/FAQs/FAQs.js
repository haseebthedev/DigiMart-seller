import React from "react";
import {
	Grid,
	Paper,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import useStyles from "./styles";

export default function PrivacyPolicy() {
	const classes = useStyles();

	return (
		<Grid container className={classes.root}>
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				component={Paper}
				className={classes.content}
			>
				<Typography
					variant="h5"
					align="center"
					style={{ marginaTop: 20, marginBottom: 30 }}
				>
					Frequenctly Asked Questions (FAQs) - DigiMart 2021
				</Typography>

				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography className={classes.heading}>
							Payments / Delivery / Shipments
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<List>
							<ListItem>
								<ListItemAvatar>
									<Avatar>1</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="Can we place order online and what are payment options?"
									secondary="Of course, you can place orders online. Upon confirmation of your payment, we will dispatch your order as soon as possible. Total time is based on the amount of time it takes to get payment authorization, order processing, and the transit time from the carrier. This can range from 24 hours to 10 days for in-stock items. To avoid delays, please ensure that you have provided us with the correct Shipping address."
								/>
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>2</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="Is cash on delivery option available?"
									secondary="Yes Cash On Delivery is available for Karachi only."
								/>
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>3</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="Do the prices of On Order Products Change?"
									secondary="We do everything to ensure that the prices on our website are correct and try to keep prices constant. Sometimes we need to change the prices, either up or down without any prior notice due to change in Forex rates/government policies. Computer Zone reserves the right to change the prices on the website at any time without prior notice. In that case, if you have ordered the product but not yet confirmed or you have even paid for a product the prices would not be valid. It's better to confirm the price's of On Order Product's through phone call first and then deposit the amount after confirmation."
								/>
							</ListItem>
						</List>
					</AccordionDetails>
				</Accordion>
				<Accordion>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography className={classes.heading}>
							Customers Rights Protection / Feedback
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<List>
							<ListItem>
								<ListItemAvatar>
									<Avatar>1</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="Why do I write reviews?"
									secondary="We want to hear your opinions. We want consumers to get the information they need to make smart buying choices. As a DigiMart client, you can submit reviews for items listed on DigiMart.com.pk. We encourage you to share your ideas, both favourable and unfavourable."
								/>
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>2</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="What are the Tips on writing a great review?"
									secondary="The best reviews include not only whether you liked or disliked a product, but also why. Feel free to talk about related products and how this item compares to them. Your review should focus on specific features of the product and your experience with it. The ideal length is 75 to 500 words. We welcome your honest opinion about the product--positive or negative. We do not remove reviews because they are critical. We believe all helpful information can inform our customers’ buying decisions."
								/>
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>3</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="What's not allowed?"
									secondary="DigiMart is pleased to provide this forum for you to share your opinions on products. While we appreciate your time and comments, we limit customer participation to one review per product and reserve the right to remove reviews that include any of the following: Objectionable material: • Obscene or distasteful content • Profanity or spiteful remarks • Promotion of illegal or immoral conduct Promotional content: • Advertisements, promotional material or repeated posts that make the same point excessively • Sentiments by or on behalf of a person or company with a financial interest in the product or a directly competing product (including reviews by publishers, manufacturers, or third-party merchants selling the product) • Reviews those are written for any form of compensation other than a free copy of the product. This includes reviews that are a part of a paid publicity package • Solicitations for helpful votes Inappropriate content: • Other people's material (this includes excessive quoting) • Phone numbers, postal mailing addresses, and URLs external to DigiMart.com.pk • Comments on other reviews visible on the page (because page visibility is subject to change without notice)"
								/>
							</ListItem>
						</List>
					</AccordionDetails>
				</Accordion>
			</Grid>
		</Grid>
	);
}
