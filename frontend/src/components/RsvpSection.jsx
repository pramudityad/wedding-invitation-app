import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import SectionContainer from "./shared/SectionContainer";
import CommentForm from "./CommentForm";
import { COLORS, BORDER_RADIUS, BUTTON_MIN_WIDTH } from "../constants";

const StyledRSVPButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(3),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
  flexWrap: "wrap",
}));

const StyledRSVPButton = styled(Button)(({ theme, colorKey }) => ({
  px: theme.spacing(5),
  py: theme.spacing(1.5),
  borderRadius: BORDER_RADIUS.button,
  minWidth: BUTTON_MIN_WIDTH,
  fontFamily: "'Poppins', sans-serif",
  textTransform: "uppercase",
  letterSpacing: "1px",
  ...(colorKey === "yes"
    ? {
        backgroundColor: COLORS.navy,
        color: COLORS.white,
        "&:hover": {
          backgroundColor: COLORS.navyLight,
          boxShadow: "0 2px 6px rgba(44, 62, 107, 0.3)",
        },
      }
    : {
        backgroundColor: "transparent",
        color: COLORS.navy,
        border: `2px solid ${COLORS.navy}`,
        "&:hover": {
          backgroundColor: "rgba(44, 62, 107, 0.06)",
          borderColor: COLORS.navyLight,
          color: COLORS.navyLight,
        },
      }),
  "&:disabled": {
    backgroundColor: "#cccccc",
    color: "#666666",
  },
}));

const RSVPTitle = styled(Typography)({
  marginBottom: "24px",
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 400,
  fontSize: "56px",
  color: COLORS.navy,
});

const LoadingIndicator = styled(Box)({
  display: "inline-flex",
  alignItems: "center",
});

const StyledLoadingProgress = styled(CircularProgress)({
  color: COLORS.navy,
  marginRight: "8px",
});

const ConfirmationText = styled("span")({
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: "italic",
  fontSize: "24px",
  color: COLORS.navy,
});

// --- Dialog styled components ---

const StyledDialogPaper = styled("div")({
  borderRadius: BORDER_RADIUS.dialog,
  padding: "8px",
  maxWidth: "400px",
  width: "100%",
  textAlign: "center",
  border: `1px solid ${COLORS.gold}4D`, // 30% opacity
  backgroundColor: COLORS.white,
});

const DialogTitleStyled = styled(DialogTitle)({
  fontFamily: "'Great Vibes', cursive",
  fontWeight: 400,
  fontSize: "40px",
  color: COLORS.navy,
  padding: "16px 24px 8px",
});

const DialogMessageStyled = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: "italic",
  fontSize: "18px",
  color: COLORS.navy,
  padding: "0 8px",
});

const DialogActionsStyled = styled(DialogActions)({
  justifyContent: "center",
  gap: "16px",
  padding: "16px 24px 20px",
  flexWrap: "wrap",
});

const ConfirmButton = styled(Button)({
  backgroundColor: COLORS.navy,
  color: COLORS.white,
  borderRadius: BORDER_RADIUS.button,
  minWidth: BUTTON_MIN_WIDTH,
  fontFamily: "'Poppins', sans-serif",
  textTransform: "uppercase",
  letterSpacing: "1px",
  "&:hover": {
    backgroundColor: COLORS.navyLight,
    boxShadow: "0 2px 6px rgba(44, 62, 107, 0.3)",
  },
});

const CancelButton = styled(Button)({
  backgroundColor: "transparent",
  color: COLORS.navy,
  border: `2px solid ${COLORS.navy}`,
  borderRadius: BORDER_RADIUS.button,
  minWidth: BUTTON_MIN_WIDTH,
  fontFamily: "'Poppins', sans-serif",
  textTransform: "uppercase",
  letterSpacing: "1px",
  "&:hover": {
    backgroundColor: "rgba(44, 62, 107, 0.06)",
    borderColor: COLORS.navyLight,
    color: COLORS.navyLight,
  },
});

const WishesDivider = styled(Box)(({ theme }) => ({
  width: "60px",
  height: "1px",
  background: theme.palette.wedding?.gold || COLORS.gold,
  margin: `${theme.spacing(4)} auto`,
}));

const WishesLabel = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: "italic",
  fontSize: "18px",
  color: theme.palette.wedding?.navy || COLORS.navy,
  marginBottom: theme.spacing(2),
}));

export default function RsvpSection({
  rsvpStatus,
  isLoading,
  handleRSVP,
  onCommentSubmitted,
}) {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChoice, setPendingChoice] = useState(null);

  const handleButtonClick = (attending) => {
    setPendingChoice(attending);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    handleRSVP(pendingChoice);
    setPendingChoice(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingChoice(null);
  };

  return (
    <SectionContainer>
      <RSVPTitle variant="h2">
        {isLoading && rsvpStatus === null ? (
          <LoadingIndicator>
            <StyledLoadingProgress size={20} />
            {t("rsvp.loading")}
          </LoadingIndicator>
        ) : rsvpStatus === null ? (
          t("rsvp.question")
        ) : (
          <ConfirmationText>
            {rsvpStatus === true
              ? t("rsvp.yesConfirmation")
              : t("rsvp.noConfirmation")}
          </ConfirmationText>
        )}
      </RSVPTitle>

      {!isLoading && rsvpStatus === null && (
        <StyledRSVPButtonsContainer>
          <StyledRSVPButton
            colorKey="yes"
            onClick={() => handleButtonClick(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("rsvp.yesButton")
            )}
          </StyledRSVPButton>

          <StyledRSVPButton
            colorKey="no"
            onClick={() => handleButtonClick(false)}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              t("rsvp.noButton")
            )}
          </StyledRSVPButton>
        </StyledRSVPButtonsContainer>
      )}

      <Dialog
        open={showConfirm}
        onClose={handleCancel}
        PaperComponent={StyledDialogPaper}
        PaperProps={{ elevation: 8 }}
      >
        <DialogTitleStyled>{t("rsvp.confirmTitle")}</DialogTitleStyled>
        <DialogContent>
          <DialogMessageStyled>
            {pendingChoice === true
              ? t("rsvp.confirmAttending")
              : t("rsvp.confirmNotAttending")}
          </DialogMessageStyled>
        </DialogContent>
        <DialogActionsStyled>
          <CancelButton onClick={handleCancel}>
            {t("rsvp.cancelButton")}
          </CancelButton>
          <ConfirmButton onClick={handleConfirm}>
            {t("rsvp.confirmButton")}
          </ConfirmButton>
        </DialogActionsStyled>
      </Dialog>

      <WishesDivider />
      <WishesLabel>{t("rsvp.wishesLabel")}</WishesLabel>
      <CommentForm onCommentSubmitted={onCommentSubmitted} />
    </SectionContainer>
  );
}
