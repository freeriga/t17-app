class MazesController < ApplicationController
  def index
    mazes = Maze.all
    render json: mazes, include: [:spots], status: 200
  end
end
