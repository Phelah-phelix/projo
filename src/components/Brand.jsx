import Image from "next/image";

/**
 * The Pamoja Network wordmark: logo image + two-line name.
 * `variant="light"` flips the text colour for dark backgrounds (footer).
 */
export default function Brand({ size = 44, light = false, nameOnly = false, hideName = false }) {
  return (
    <span className="brand">
      {!nameOnly && (
        <Image
          className="brand__logo"
          src="/logo.jpeg"
          alt="Pamoja Network logo"
          width={size}
          height={size}
          priority
          style={{ width: size, height: size }}
        />
      )}
      {!hideName && (
        <span className="brand__name" style={light ? { color: "#fff" } : undefined}>
          PAMOJA
          <span>NETWORK</span>
        </span>
      )}
    </span>
  );
}
