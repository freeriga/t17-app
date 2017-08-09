class ClipsController < ApplicationController
  def index
    clips = Clip.all
    render json: clips, include: :clipfiles, status: 200
  end

  def create
    data = params.require(:file)
    clip = Clip.create!(name: data.original_filename)
    TranscodeJob.perform_later(
      data.path, clip.id
    )
    render json: data.original_filename, status: 200
  end
end
