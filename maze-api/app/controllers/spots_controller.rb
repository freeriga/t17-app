class SpotsController < ApplicationController
  def create
    maze = Maze.friendly.find(params.require(:maze_id))
    clip = Clip.find(params.require(:clip_id))
    spot = Spot.create!(maze: maze, clip: clip)
    render json: spot, status: 200
  end
end
