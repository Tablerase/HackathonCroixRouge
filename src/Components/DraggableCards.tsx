import { useState, useRef } from "react";

interface Card {
  id: number;
  text: string;
}

interface Position {
  x: number;
  y: number;
}

export const DraggableCards = () => {
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
  const containerRef = useRef<HTMLDivElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const draggableAreaRef = useRef<HTMLDivElement>(null);

  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      text: "Card 1 - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 2,
      text: "Card 2 - Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      id: 3,
      text: "Card 3 - Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      id: 4,
      text: "Card 4 - Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ]);

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
    setDragPosition({ x: e.clientX, y: e.clientY });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.id.toString());

    if (e.target instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.target, 20, 20);
    }
  };

  const handleDragOver = (e: React.DragEvent, targetCard: Card) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragPosition({ x: e.clientX, y: e.clientY });
    setTargetCardId(targetCard.id);
    setIsOverDropZone(false);
  };

  const handleDropZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragPosition({ x: e.clientX, y: e.clientY });
    setTargetCardId(null);
    setIsOverDropZone(true);
    setIsOverDraggableArea(false);
  };

  const handleDraggableAreaDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragPosition({ x: e.clientX, y: e.clientY });
    setTargetCardId(null);
    setIsOverDropZone(false);
    setIsOverDraggableArea(true);
  };

  const handleDrop = (e: React.DragEvent, targetCard: Card) => {
    e.preventDefault();
    reorderCards(targetCard.id);
  };

  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedCard) return;

    // If we're dragging from the list to the drop zone
    if (!droppedCard || droppedCard.id !== draggedCard.id) {
      // Set the dragged card as the dropped card
      setDroppedCard(draggedCard);

      // Remove the card from the original list
      setCards(cards.filter((card) => card.id !== draggedCard.id));
    }

    setDragging(false);
    setDraggedCard(null);
    setIsOverDropZone(false);
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
      e.preventDefault();
      return;
    }

    const touch = e.touches[0];
    setDragging(true);
    setDraggedCard(card);
    const position = { x: touch.clientX, y: touch.clientY };
    setDragPosition(position);
    setTouchStartPosition(position);
    console.debug(touchStartPosition);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling while dragging
    if (!dragging || !draggedCard) return;

    const touch = e.touches[0];
    setDragPosition({ x: touch.clientX, y: touch.clientY });

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
      }
    } else if (
      isOverDraggableArea &&
      draggedCard &&
      droppedCard &&
      draggedCard.id === droppedCard.id
    ) {
      // If we're moving the dropped card back to the list
      setCards([...cards, draggedCard]);
      setDroppedCard(null);
    } else if (targetCardId !== null && draggedCard) {
      reorderCards(targetCardId);
    }
    console.debug(e);

    setDragging(false);
    setDraggedCard(null);
    setTouchStartPosition(null);
    setTargetCardId(null);
    setIsOverDropZone(false);
    setIsOverDraggableArea(false);
  };

  // Function to reorder cards (used by both drag and touch handlers)
  const reorderCards = (targetId: number) => {
    if (!draggedCard) return;

    const draggedCardIndex = cards.findIndex(
      (card) => card.id === draggedCard.id
    );
    const targetCardIndex = cards.findIndex((card) => card.id === targetId);

    if (
      draggedCardIndex !== -1 &&
      targetCardIndex !== -1 &&
      draggedCardIndex !== targetCardIndex
    ) {
      const newCards = [...cards];
      const [movedCard] = newCards.splice(draggedCardIndex, 1);
      newCards.splice(targetCardIndex, 0, movedCard);
      setCards(newCards);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
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
            width: "60%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            transition: "all 0.3s ease",
            zIndex: 10, // Ensure drop zone is above the draggable area
            position: "relative", // Make sure z-index works
          }}
        >
          <h3>Drop Zone (Single Card)</h3>

          {!droppedCard && !isOverDropZone && (
            <div
              style={{
                color: "#6c757d",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              Drag a card here
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
                    : "#fff",
                border: "1px solid #28a745",
                borderRadius: "5px",
                minHeight: "80px",
                cursor: "move",
                opacity:
                  draggedCard && draggedCard.id === droppedCard.id ? 0.5 : 1,
                touchAction: "none",
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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: "10px",
          backgroundColor: isOverDraggableArea
            ? "rgba(0, 123, 255, 0.1)"
            : "transparent",
          transition: "all 0.3s ease",
          flexDirection: "row",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          minHeight: "200px",
        }}
      >
        {cards.map((card, index) => {
          const rotationAngle = card.id % 2 === 0 ? 5 : -5; // Rotate cards based on their ID

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
                    : "#fff",
                border:
                  targetCardId === card.id && draggedCard?.id !== card.id
                    ? "2px dashed #007bff"
                    : "1px solid #ccc",
                borderRadius: "5px",
                cursor:
                  droppedCard && droppedCard.id !== card.id
                    ? "not-allowed"
                    : "move",
                // minHeight: "100px",
                height: "400px",
                width: "160px", // Fixed width for cards
                marginBottom: "10px",
                opacity: draggedCard && draggedCard.id === card.id ? 0.5 : 1,
                touchAction: "none",
                transform: `rotate(${rotationAngle}deg)`,
                transition:
                  "transform 0.3s ease, background-color 0.3s ease, border 0.3s ease",
                margin: "0 -15px", // Make cards slightly overlap
                position: "relative",
                zIndex: index, // Stack cards with proper z-index
                transformOrigin: "bottom center", // Rotate from bottom center
              }}
            >
              {card.text}
            </div>
          );
        })}
      </div>

      {dragging && draggedCard && (
        <div
          style={{
            position: "fixed",
            left: `${dragPosition.x}px`,
            top: `${dragPosition.y}px`,
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          {draggedCard.text}
        </div>
      )}
    </div>
  );
};
