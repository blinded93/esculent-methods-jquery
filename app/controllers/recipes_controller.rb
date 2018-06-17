class RecipesController < ApplicationController
  def index
    recipes = Recipe.all
    render json: recipes, status: 200
  end

  def show
    recipe = Recipe.find(params[:id])
    render json: recipe, status: 200
  end
end
