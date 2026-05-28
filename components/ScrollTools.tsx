import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollTools() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 280);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className={`scroll-tools${visible ? " visible" : ""}`} aria-label="页面滚动工具">
      <button type="button" aria-label="回到顶部" title="回到顶部" onClick={() => scrollToEdge("top")}>
        <ArrowUpToLine size={18} />
      </button>
      <button type="button" aria-label="跳到底部" title="跳到底部" onClick={() => scrollToEdge("bottom")}>
        <ArrowDownToLine size={18} />
      </button>
    </div>
  );
}

function scrollToEdge(edge: "top" | "bottom") {
  window.scrollTo({
    top: edge === "top" ? 0 : document.documentElement.scrollHeight,
    behavior: "smooth",
  });
}
