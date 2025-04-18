import { useState, useRef, useEffect, use } from "react";

interface Card {
  id: number;
  text: string;
}

interface Position {
  x: number;
  y: number;
}

interface DraggableCardsProps {
  initialCards?: Card[];
  onCardDrop?: (card: Card) => void;
  customText?: boolean;
  customTextValue?: string;
  onCustomTextChange?: (value: string) => void;
  onCustomTextSubmit?: () => void;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  selectedAnswer?: string;
}

/**
 * ! TODO: Fix drag preview pb on mobile (offset issue), Handle text input (no change at input),
 * ! Mobile drop zone not validating the question
 */

// Helper function to calculate position including scrolling and container offsets
// const calculateDragPosition = (
//   e: React.DragEvent | React.TouchEvent | Touch,
//   containerRef:
//     | React.RefObject<HTMLDivElement | null>
//     | React.RefObject<HTMLDivElement>
// ): Position => {
//   const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
//   const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;

//   console.log("Touch", clientX, clientY);
//   // Get container position if available
//   if (containerRef && containerRef.current) {
//     const containerRect = containerRef.current.getBoundingClientRect();
//     console.log(containerRect);
//     // Calculate position relative to the container
//     const x = clientX - containerRect.left + containerRef.current.scrollLeft;
//     const y = clientY - containerRect.top + containerRef.current.scrollTop;
//     console.log("Calculated Touch", x, y);
//     return {
//       x: clientX - containerRect.left + containerRef.current.scrollLeft,
//       y: clientY - containerRect.top + containerRef.current.scrollTop,
//     };
//   }

//   // Fallback if container ref not available
//   return { x: clientX, y: clientY };
// };

export const DraggableCards = ({
  initialCards = [],
  onCardDrop,
  customText = true,
  customTextValue = "",
  onCustomTextChange,
  onCustomTextSubmit,
  selectedAnswer,
}: DraggableCardsProps) => {
  const [dragging, setDragging] = useState(false);
  const [draggedCard, setDraggedCard] = useState<Card | null>(null);
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });
  const [touchStartPosition, setTouchStartPosition] = useState<Position | null>(
    null
  );
  const [targetCardId, setTargetCardId] = useState<number | null>(null);
  const [isOverDropZone, setIsOverDropZone] = useState(false);
  const [isOverDraggableArea, setIsOverDraggableArea] = useState(false);
  const [droppedCard, setDroppedCard] = useState<Card | null>(null);
  const dropZoneTextSize = 150; // Max length of the text in the drop zone
  const containerRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [dropZoneText, setDropZoneText] = useState<string>(
    customTextValue || ""
  );
  const draggableAreaRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState<Card[]>(
    initialCards.length > 0
      ? initialCards
      : [
          {
            id: 1,
            text: "Card 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          },
          // ... your default cards
        ]
  );
  useEffect(() => {
    if (droppedCard) {
      if (!cards.some((card) => card.id === droppedCard.id)) {
        setCards((prevCards) => [...prevCards, droppedCard]);
      }
    }
    setDroppedCard(null);
    setDropZoneText(customTextValue || "");
  }, [cards]);

  // For desktop - Drag events
  const handleDragStart = (e: React.DragEvent, card: Card) => {
    // If there's a card in the drop zone and we're trying to drag a card from the list
    // (indicated by the card not being the same as the dropped card)
    if (droppedCard && card.id !== droppedCard.id) {
      e.preventDefault();
      return;
    }

    setDragging(true);
    setDraggedCard(card);

    // Use pageX and pageY instead of clientX and clientY to account for scroll
    const position = {
      x: e.pageX,
      y: e.pageY,
    };
    setDragPosition(position);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.id.toString());

    if (e.target instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.target, 20, 20);
    }
  };

  const handleDragOver = (e: React.DragEvent, targetCard: Card) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const position = {
      x: e.pageX,
      y: e.pageY,
    };
    setDragPosition(position);
    setTargetCardId(targetCard.id);
    setIsOverDropZone(false);
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const position = {
      x: e.pageX,
      y: e.pageY,
    };
    setDragPosition(position);
    setTargetCardId(null);
    setIsOverDropZone(true);
    setIsOverDraggableArea(false);
  };

  const handleDraggableAreaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const position = {
      x: e.pageX,
      y: e.pageY,
    };
    setDragPosition(position);
    setTargetCardId(null);
    setIsOverDropZone(false);
    setIsOverDraggableArea(true);
  };

  const handleDrop = (e: React.DragEvent, targetCard: Card) => {
    e.preventDefault();
    console.debug("selectedAnswer", selectedAnswer);
    console.debug("Dropped on card:", targetCard);
    // reorderCards(targetCard.id);
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedCard) return;

    // If we're dragging from the list to the drop zone
    if (!droppedCard || droppedCard.id !== draggedCard.id) {
      setDroppedCard(draggedCard);
      setCards(cards.filter((card) => card.id !== draggedCard.id));
      if (onCardDrop) {
        onCardDrop(draggedCard);
      }
    }

    setDragging(false);
    setDraggedCard(null);
    setIsOverDropZone(false);
  };

  // Use the provided handlers if they exist
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onCustomTextChange) {
      onCustomTextChange(e.target.value);
      setDropZoneText(e.target.value);
    } else {
      setDropZoneText(e.target.value);
    }
  };

  const handleTextSubmit = () => {
    if (onCustomTextSubmit) {
      onCustomTextSubmit();
    } else {
      console.log("Submitted text:", dropZoneText);
      setDropZoneText(""); // Clear the text after submit
    }
  };

  const handleDraggableAreaDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedCard) return;

    // Only handle if we're moving the dropped card back to the list
    if (droppedCard && droppedCard.id === draggedCard.id) {
      // Add the card back to the original list
      setCards([...cards, draggedCard]);
      // Clear the dropped card
      setDroppedCard(null);
    }

    setDragging(false);
    setDraggedCard(null);
    setIsOverDraggableArea(false);
  };

  const handleDragEnd = () => {
    setDragging(false);
    setDraggedCard(null);
    setTargetCardId(null);
    setIsOverDropZone(false);
    setIsOverDraggableArea(false);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // For mobile - Touch events
  const handleTouchStart = (e: React.TouchEvent, card: Card) => {
    // If there's a card in the drop zone and we're trying to drag a card from the list
    if (droppedCard && card.id !== droppedCard.id) {
      return;
    }

    const touch = e.touches[0];
    setDragging(true);
    setDraggedCard(card);
    // Use pageX and pageY instead of clientX and clientY
    const position = {
      x: touch.pageX,
      y: touch.pageY,
    };
    setDragPosition(position);
    setTouchStartPosition(position);
    console.debug(touchStartPosition);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || !draggedCard) return;

    const touch = e.touches[0];
    const position = {
      x: touch.pageX,
      y: touch.pageY,
    };
    setDragPosition(position);

    // Find which card we're over based on position
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll("[data-card-id]");
      let foundCard = false;

      for (const element of Array.from(elements)) {
        const rect = element.getBoundingClientRect();
        const cardId = element.getAttribute("data-card-id");

        if (
          cardId &&
          touch.clientY >= rect.top &&
          touch.clientY <= rect.bottom
        ) {
          setTargetCardId(parseInt(cardId));
          setIsOverDropZone(false);
          setIsOverDraggableArea(false);
          foundCard = true;
          break;
        }
      }

      // Check if touching over the drop zone
      if (!foundCard && dropZoneRef.current) {
        const dropRect = dropZoneRef.current.getBoundingClientRect();
        if (
          touch.clientX >= dropRect.left &&
          touch.clientX <= dropRect.right &&
          touch.clientY >= dropRect.top &&
          touch.clientY <= dropRect.bottom
        ) {
          setIsOverDropZone(true);
          setIsOverDraggableArea(false);
          setTargetCardId(null);
        } else if (draggableAreaRef.current) {
          // Check if touching over the draggable area
          const draggableRect =
            draggableAreaRef.current.getBoundingClientRect();
          if (
            touch.clientX >= draggableRect.left &&
            touch.clientX <= draggableRect.right &&
            touch.clientY >= draggableRect.top &&
            touch.clientY <= draggableRect.bottom
          ) {
            setIsOverDraggableArea(true);
            setIsOverDropZone(false);
            setTargetCardId(null);
          } else {
            setIsOverDropZone(false);
            setIsOverDraggableArea(false);
          }
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isOverDropZone && draggedCard) {
      // If we're moving from list to drop zone
      if (!droppedCard || droppedCard.id !== draggedCard.id) {
        setDroppedCard(draggedCard);
        setCards(cards.filter((card) => card.id !== draggedCard.id));
        if (onCardDrop) {
          onCardDrop(draggedCard);
        }
      }
    } else if (
      isOverDraggableArea &&
      draggedCard &&
      droppedCard &&
      draggedCard.id === droppedCard.id
    ) {
      // If we're moving the dropped card back to the list
      // Add the card back to the original list in its original position
      const updatedCards = [...cards];
      // Insert the card back at its original position (by id order)
      const insertIndex = updatedCards.findIndex(
        (card) => card.id > draggedCard.id
      );
      if (insertIndex === -1) {
        updatedCards.push(draggedCard);
      } else {
        updatedCards.splice(insertIndex, 0, draggedCard);
      }
      setCards(updatedCards);
      setDroppedCard(null);
    }
    // Remove the else if with reorderCards
    // else if (targetCardId !== null && draggedCard) {
    //   reorderCards(targetCardId);
    // }

    console.debug(e);

    setDragging(false);
    setDraggedCard(null);
    setTouchStartPosition(null);
    setTargetCardId(null);
    setIsOverDropZone(false);
    setIsOverDraggableArea(false);
  };

  // const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   setDropZoneText(e.target.value);
  // };

  // const handleTextSubmit = () => {
  //   // Add your submit logic here
  //   console.log("Submitted text:", dropZoneText);
  //   setDropZoneText(""); // Clear the text after submit
  // };

  // Function to reorder cards (used by both drag and touch handlers)
  // const reorderCards = (targetId: number) => {
  //   if (!draggedCard) return;

  //   const draggedCardIndex = cards.findIndex(
  //     (card) => card.id === draggedCard.id
  //   );
  //   const targetCardIndex = cards.findIndex((card) => card.id === targetId);

  //   if (
  //     draggedCardIndex !== -1 &&
  //     targetCardIndex !== -1 &&
  //     draggedCardIndex !== targetCardIndex
  //   ) {
  //     const newCards = [...cards];
  //     const [movedCard] = newCards.splice(draggedCardIndex, 1);
  //     newCards.splice(targetCardIndex, 0, movedCard);
  //     setCards(newCards);
  //   }
  // };
  // Font size adjustment
  const fontSize = window.innerWidth < 768 ? "12px" : "18px"; // Smaller font on mobile

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        justifyContent: "center",
        minHeight: "50vh", // Minimum height for the container
        position: "relative", // Make parent relative for positioning
        paddingBottom: "220px", // Add padding to prevent overlap with cards
      }}
    >
      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "20px",
          width: "100%",
          alignItems: "center",
        }}
      >
        {/* Drop Zone - Only accepts one card */}
        <div
          ref={dropZoneRef}
          onDragOver={handleDropZoneDragOver}
          onDrop={handleDropZoneDrop}
          onDragEnter={(e) => e.preventDefault()}
          style={{
            border: isOverDropZone ? "3px dashed #28a745" : "3px dashed #ccc",
            borderRadius: "8px",
            padding: "20px",
            backgroundColor: isOverDropZone
              ? "rgba(40, 167, 69, 0.1)"
              : "#f8f9fa",
            minHeight: "150px",
            maxHeight: "250px", // Limit maximum height
            width: "60%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            transition: "all 0.3s ease",
            zIndex: 10,
            position: "relative",
            overflow: "auto", // Add scrolling if content is too large
            marginBottom: "30px", // Add explicit margin at the bottom
            fontSize: fontSize,
          }}
        >
          {/* Rest of the drop zone content remains the same */}
          {!droppedCard && !isOverDropZone && customText && (
            <div style={{ position: "relative", width: "100%" }}>
              <textarea
                placeholder="Enter your text here or drag a card..."
                value={dropZoneText}
                onChange={handleTextChange}
                maxLength={dropZoneTextSize}
                name="dropZoneText"
                id="dropZoneText"
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "10px",
                  paddingBottom: "30px", // Add space at the bottom for the button
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  resize: "none",
                  fontFamily: "inherit",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "8px",
                  left: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "calc(100% - 20px)",
                }}
              >
                <small style={{ color: "#6c757d" }}>
                  {dropZoneText.length}/{dropZoneTextSize}
                </small>
                <button
                  onClick={handleTextSubmit}
                  disabled={!dropZoneText.trim()}
                  style={{
                    background: dropZoneText.trim() ? "#007bff" : "#e9ecef",
                    color: dropZoneText.trim() ? "white" : "#6c757d",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: dropZoneText.trim() ? "pointer" : "default",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          )}

          {droppedCard && (
            <div
              key={droppedCard.id}
              data-card-id={droppedCard.id}
              draggable
              onDragStart={(e) => handleDragStart(e, droppedCard)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, droppedCard)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                padding: "20px",
                backgroundColor:
                  draggedCard && draggedCard.id === droppedCard.id
                    ? "#f0f0f0"
                    : undefined,
                backgroundImage:
                  draggedCard && draggedCard.id === droppedCard.id
                    ? "none"
                    : "linear-gradient(146deg, #FF512F, #DD2476)",
                border: "1px solid #28a745",
                borderRadius: "5px",
                minHeight: "80px",
                cursor: "move",
                opacity:
                  draggedCard && draggedCard.id === droppedCard.id ? 0.5 : 1,
                touchAction: "none",
                color:
                  draggedCard && draggedCard.id === droppedCard.id
                    ? "#000"
                    : "#fff",
                boxShadow:
                  "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
                transition:
                  "transform 0.3s ease, background-color 0.3s ease, border 0.3s ease",
              }}
            >
              {droppedCard.text}
              <div
                style={{ fontSize: "12px", marginTop: "8px", color: "#6c757d" }}
              >
                Drag back to return to list
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Make the entire area (except drop zone) a draggable area */}
      <div
        ref={draggableAreaRef}
        onDragOver={handleDraggableAreaDragOver}
        onDrop={handleDraggableAreaDrop}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "10px",
          backgroundColor: isOverDraggableArea
            ? "rgba(0, 123, 255, 0.1)"
            : "transparent",
          transition: "all 0.3s ease",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          height: "200px", // Fixed height instead of minHeight
          zIndex: 5,
          borderTop: "1px solid #e0e0e0", // Optional visual separator
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            maxWidth: "100%",
            overflow: "visible",
            padding: "0 20px", // Add padding on sides to prevent edge-clipping
          }}
        >
          {cards.map((card, index) => {
            // Calculate rotation angles based on card position and total count
            const totalCards = cards.length;
            const middleIndex = (totalCards - 1) / 2;
            const offset = index - middleIndex;
            // Scale angle based on screen size
            const angleScale = window.innerWidth < 768 ? 0.6 : 1; // Reduce angles on mobile
            const rotationAngle = offset * (70 / totalCards) * angleScale;

            // Calculate horizontal positioning
            const cardWidth = window.innerWidth < 768 ? 120 : 160; // Smaller cards on mobile
            const overlapFactor = window.innerWidth < 768 ? -40 : -30; // Less overlap on mobile

            return (
              <div
                key={card.id}
                data-card-id={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, card)}
                onDragOver={(e) => handleDragOver(e, card)}
                onDrop={(e) => handleDrop(e, card)}
                onDragEnd={handleDragEnd}
                onDragEnter={handleDragEnter}
                onTouchStart={(e) => handleTouchStart(e, card)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  padding: "20px",
                  backgroundColor:
                    targetCardId === card.id && draggedCard?.id !== card.id
                      ? "#f0f8ff"
                      : draggedCard && draggedCard.id === card.id
                      ? "#f0f0f0"
                      : undefined,
                  backgroundImage:
                    (targetCardId === card.id && draggedCard?.id !== card.id) ||
                    (draggedCard && draggedCard.id === card.id)
                      ? "none"
                      : "linear-gradient(146deg, #FF512F, #DD2476)",
                  // border:
                  //   targetCardId === card.id && draggedCard?.id !== card.id
                  //     ? "2px dashed #007bff"
                  //     : "1px solid #ccc",
                  borderRadius: "5px",
                  cursor:
                    droppedCard && droppedCard.id !== card.id
                      ? "not-allowed"
                      : "move",
                  height: window.innerWidth < 768 ? "300px" : "350px",
                  width: `${cardWidth}px`,
                  marginBottom: "10px",
                  opacity: draggedCard && draggedCard.id === card.id ? 0.5 : 1,
                  touchAction: "none",
                  transform: `rotate(${rotationAngle}deg)`,
                  transition:
                    "transform 0.3s ease, background-color 0.3s ease, border 0.3s ease",
                  margin: `0 ${overlapFactor / 2}px`,
                  position: "relative",
                  zIndex: totalCards - Math.abs(offset), // Center cards have higher z-index
                  transformOrigin: "bottom center",
                  fontSize: fontSize,
                  textAlign: "center",
                  color:
                    (targetCardId === card.id && draggedCard?.id !== card.id) ||
                    (draggedCard && draggedCard.id === card.id)
                      ? "#000"
                      : "#fff",
                  boxShadow:
                    "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
                }}
              >
                {card.text}
              </div>
            );
          })}
        </div>
      </div>

      {dragging && draggedCard && window.innerWidth < 768 && (
        <div
          style={{
            position: "fixed",
            top: dragPosition.y - 40 / 2,
            left: dragPosition.x - 120 / 2,
            transform: "translate(-50%, -50%)",
            backgroundImage: "linear-gradient(146deg, #FF512F, #DD2476)",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            pointerEvents: "none",
            zIndex: 2000,
            width: "120px",
            maxHeight: "80px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            opacity: 0.9,
            color: "#fff",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          {draggedCard.text.length > 30
            ? draggedCard.text.substring(0, 30) + "..."
            : draggedCard.text}
        </div>
      )}
    </div>
  );
};
