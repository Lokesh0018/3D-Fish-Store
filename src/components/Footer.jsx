export default function Footer() {
  return (
    <footer className="footer">
      <a className="logo" href="#hero" aria-label="Finsmith, back to top">FINSMITH<sup aria-hidden="true">®</sup></a>
      <nav className="footer__links" aria-label="Footer">
        <a href="#shop">Shop</a>
        <a href="#spotlight">Fish of the month</a>
        <a href="#journey">Shipping</a>
        <a href="#faq">FAQ</a>
      </nav>
      <p className="footer__note">© {new Date().getFullYear()} Finsmith. Live fish ship within the contiguous US.</p>
    </footer>
  );
}
