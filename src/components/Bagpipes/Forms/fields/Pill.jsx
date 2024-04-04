import { useDrag } from 'react-dnd';

const Pill = ({ id, text }) => {
    const [{isDragging}, dragRef] = useDrag({
        type: 'PILL',
        item: { id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div ref={dragRef} className="pill" style={{ opacity: isDragging ? 0.5 : 1 }}>
            {text}
        </div>
    );
};

export default Pill;