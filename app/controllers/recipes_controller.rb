class RecipesController < ApplicationController
  before_action :create_favorited_recipe_service, only: [:favorited, :favorite]

  def index
    pagy, recipes = pagy(Recipe.by_favorites, {items: 5})
    render json: recipes,
           meta: pagy,
           status: 200
  end

  def create
    recipe = current_user.recipes.create(recipe_params)
    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include: ['ingredient_amounts.ingredient'],
           status: 200
  end

  def show
    recipe = Recipe.find_by(id:params[:id])
    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include: ['ingredient_amounts.ingredient'],
           status: 200
  end

  def update
    recipe = Recipe.find_by(id:params[:id])
    recipe.update(recipe_params)
    render json: recipe,
           serializer: RecipeIngredientsSerializer,
           include: ['ingredient_amounts.ingredient'],
           status: 200
  end

  def favorited
    if logged_in?
      @favorite.current_user = current_user
      @favorite.favorited?
    end
    render json: @favorite,
           status: 200
  end

  def favorite
    if logged_in?
      @favorite.current_user = current_user
      @favorite.toggle_favorite
    else
      @favorite.errors[:loggedOut] = ("Must be logged in to do that")
    end
    render json: @favorite,
           status: 200
  end

  def search
    meta, recipes = pagy(Recipe.search(params[:query]), {items: 3, query:params[:query]})
    render json: recipes,
           meta: meta,
           status: 200
  end

  def ingredient_search
    ingredient_ids = Ingredient.ids_from_names(params[:query])
    meta, recipes = pagy(Recipe.with_ingredients(ingredient_ids), {items: 2, query:params[:query]})
    render json: recipes,
           meta: meta,
           status: 200
  end

  private
    def create_favorited_recipe_service
      @favorite = FavoritedRecipeService.new(recipe_id:params[:recipe_id])
    end

    def share_params
      params[:user_id] = current_user.id
      params.permit(:user_id, :friend_id, :recipe_id)
    end

    def recipe_params
      params.require(:recipe).permit(:name, :cook_time, :prep_time, :servings, :skill_level, :image, :directions => [], ingredient_attributes:[:id, :quantity, :unit, :name, :state])
    end
end
