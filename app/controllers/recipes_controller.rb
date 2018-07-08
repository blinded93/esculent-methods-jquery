class RecipesController < ApplicationController
  def index
    recipes = Recipe.by_favorites
    render json: recipes, status: 200
  end

  def show
    recipe = Recipe.find(params[:id])
    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include:['ingredient_amounts.ingredient'],
           status: 200
  end
end
