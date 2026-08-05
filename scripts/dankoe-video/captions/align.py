#!/usr/bin/env python
"""Forced alignment: audio + guion conocido -> timestamps por palabra (JSON).

Uso:
    python align.py <audio.wav> <guion.txt> <salida.json> [iso=spa]

Camino ONNX puro de ctc-forced-aligner (modelo MMS multilingüe, sin torch).
NO transcribe: toma el texto del guion como verdad y solo resuelve el tiempo de
cada palabra. Salida: {"words":[{"text","start","end","score"}]}.
"""
import sys, os, json
import onnxruntime
from ctc_forced_aligner import (
    ensure_onnx_model, MODEL_URL, Tokenizer,
    load_audio, generate_emissions, preprocess_text,
    get_alignments, get_spans, postprocess_results,
)

def main():
    audio_path, transcript_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
    iso = sys.argv[4] if len(sys.argv) > 4 else "spa"

    model_path = os.path.join(os.path.expanduser("~"), "ctc_forced_aligner", "model.onnx")
    ensure_onnx_model(model_path, MODEL_URL)
    session = onnxruntime.InferenceSession(model_path)
    tokenizer = Tokenizer()

    text = open(transcript_path, encoding="utf-8").read()
    audio = load_audio(audio_path, ret_type="np")

    emissions, stride = generate_emissions(session, audio, batch_size=4)
    tokens_starred, text_starred = preprocess_text(
        text, romanize=True, language=iso, split_size="word",
    )
    segments, scores, blank = get_alignments(emissions, tokens_starred, tokenizer)
    spans = get_spans(tokens_starred, segments, blank)
    word_ts = postprocess_results(text_starred, spans, stride, scores)

    words = [{
        "text": w["text"],
        "start": round(float(w["start"]), 3),
        "end": round(float(w["end"]), 3),
        "score": round(float(w["score"]), 2),
    } for w in word_ts]

    json.dump({"words": words}, open(out, "w"), ensure_ascii=False, indent=2)
    print(f"OK {len(words)} palabras -> {out}  (stride={stride}ms)")
    for w in words[:10]:
        print(f"  {w['start']:6.2f}-{w['end']:6.2f}  {w['text']}")

if __name__ == "__main__":
    main()
