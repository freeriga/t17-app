class ClipfilesController < ApplicationController
  def create
    clipfile = params.require(:file)
    TranscodeJob.perform_later(clipfile.path)
    render json: clipfile.original_filename, status: 200
  end
end
