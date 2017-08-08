class MazesController < ApplicationController
  def index
    mazes = Maze.all
    render json: mazes, status: 200
  end
end
