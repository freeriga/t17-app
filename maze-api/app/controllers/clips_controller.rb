class ClipsController < ApplicationController
  def index
    clips = Clip.all
    render json: clips, status: 200
  end
end
