class RecipesController < ApplicationController
  before_action :create_favorited_recipe_service, only: [:favorited, :favorite]

  def index
    recipes = Recipe.by_favorites
    render json: recipes, status: 200
  end

  def create
    recipe = Recipe.new(recipe_params)
    # binding.pry
    render json: recipe
  end

  def show
    recipe = Recipe.find_by_id(params[:id])
    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include:['ingredient_amounts.ingredient'],
           status: 200
  end

  def favorited
    if logged_in?
      @f.current_user = current_user
      @f.favorited?
    end
    render json: @f,
           status:200
  end

  def favorite
    if logged_in?
      @f.current_user = current_user
      @f.toggle_favorite
    else
      @f.errors[:loggedOut] = ("Must be logged in to do that")
    end
    render json: @f,
           status:200
  end

  private
    def create_favorited_recipe_service
      @f = FavoritedRecipeService.new(recipe_id:params[:recipe_id])
    end

    def recipe_params
      params.require(:recipe).permit(:name, :cook_time, :prep_time, :servings, :difficulty, :directions, ingredient_attributes:[:quantity, :unit, :name, :state])
    end
end
