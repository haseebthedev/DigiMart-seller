import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Grid, Typography, Button } from "@material-ui/core";

function generateCroppedImage(canvas) {
	if (!canvas) {
		return;
	}
	return canvas.toDataURL("image/png", 0.92);
}

const ImageCrop = (props) => {
	const [upImg, setUpImg] = useState();
	const imgRef = useRef(null);
	const previewCanvasRef = useRef(null);
	const [crop, setCrop] = useState({ unit: "%", width: 45, aspect: 1 / 1 });
	const [completedCrop, setCompletedCrop] = useState(null);

	const onSelectFile = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener("load", () => setUpImg(reader.result));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onLoad = useCallback((img) => {
		imgRef.current = img;
	}, []);

	const setCroppedImage = () => {
		props.onProfileChange(generateCroppedImage(previewCanvasRef.current));
		props.handleClose();
	};

	useEffect(() => {
		if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
			return;
		}

		const image = imgRef.current;
		const canvas = previewCanvasRef.current;
		const crop = completedCrop;

		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext("2d");
		const pixelRatio = window.devicePixelRatio;

		canvas.width = crop.width * pixelRatio;
		canvas.height = crop.height * pixelRatio;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = "high";

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);
	}, [completedCrop]);

	return (
		<div className="App">
			<div>
				<input type="file" accept="image/*" onChange={onSelectFile} />
			</div>
			<Grid container spacing={2}>
				<Grid
					item
					xs={12}
					sm={6}
					style={{ marginTop: "20px" }}
					align="center"
				>
					{upImg && (
						<>
							<Typography gutterBottom>Original</Typography>
							<div
								style={{
									overflowY: "scroll",
									height: "300px",
								}}
							>
								<ReactCrop
									style={{
										border: "2px solid #262626",
									}}
									src={upImg}
									onImageLoaded={onLoad}
									crop={crop}
									onChange={(c) => setCrop(c)}
									onComplete={(c) => setCompletedCrop(c)}
								/>
							</div>
						</>
					)}
				</Grid>
				<Grid
					item
					xs={12}
					sm={6}
					style={{ marginTop: "20px" }}
					align="center"
				>
					{upImg && (
						<>
							<Typography gutterBottom>Cropped</Typography>
							<div
								style={{
									overflow: "hidden",
								}}
							>
								<canvas
									alt="Crop"
									ref={previewCanvasRef}
									style={{
										border: "2px solid black",
										width: "300px",
										height: "300px",
									}}
								/>
							</div>
						</>
					)}
				</Grid>
			</Grid>
			<Grid>
				<Button
					style={{
						position: "absolute",
						bottom: 20,
						right: 20,
					}}
					variant="contained"
					color="primary"
					onClick={setCroppedImage}
				>
					SAVE
				</Button>
			</Grid>
		</div>
	);
};

export default ImageCrop;
