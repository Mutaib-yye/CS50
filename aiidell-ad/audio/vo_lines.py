"""Continuous, cheerful voice-over: (window start, window end, text) in video seconds.
Each part is time-fitted to fill its window so the narration flows with no silent gaps.
Used by make_vo.py (Kokoro) and make_vo_qwen.py (Qwen3-TTS).
"AiiDell" is spelled phonetically ("Eye Dell") so TTS engines pronounce it correctly."""
LINES = [
    (0.35, 6.0, "Hey! Meet Rahul and Arjun! These two want to send a sweet surprise to someone special in Indonesia!"),
    (6.05, 13.0, "But look at Rahul! Searching this, searching that... the best shop, the best courier, asking everyone! And sending it directly? So expensive!"),
    (13.05, 20.15, "And Arjun? He just opens Eye Dell dot com, picks a pretty bouquet, adds her details, and... done! Easy peasy!"),
    (20.2, 27.85, "Our team right here in Indonesia takes care of everything, wraps it with love, and brings it right to her door! Look at that smile!"),
    (27.9, 37.5, "You can send beautiful flowers, thoughtful gifts, delicious food, yummy Indian snacks, and birthday cakes too! Same-day delivery may be available, depending on the location!"),
    (37.55, 44.6, "So, one is still searching and waiting... while the other is already smiling, on a sweet video call with her! Aww, so cute!"),
    (44.7, 49.55, "Different countries, one simple way to make someone smile. Eye Dell dot com!"),
]
