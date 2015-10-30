
class DropsController < ApplicationController

  def show
    drops = Drop.order("created_at DESC").limit(50).to_json
    render json: drops
  end

  def create
    # needs `current_user` helper method to exist
    drop = current_user.drops.new(drop_params)
    if drop.save
      render plain: {success: true}.to_json
    else
      render plain: {failure: drop.errors.full_messages.join(",")}.to_json, status: 500
    end
  end

  def drop_params 
    params.require(:drop).permit(:photo, :text)
      .merge(lonlat: Drop.create_lonlat(params[:drop][:coords]))
  end
end
