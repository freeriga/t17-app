class TranscodeJob < ApplicationJob
  queue_as :default

  def perform(path)
    out = path + ".mp4"
    system(
      "avconv", "-i", path,
      "-c:v:0", "libx264", "-preset", "slow", "-crf", "22",
      "-c:a:0", "libvorbis", "-qscale:a", "5", "-ar", "48000",
      out
    )
  end
end
